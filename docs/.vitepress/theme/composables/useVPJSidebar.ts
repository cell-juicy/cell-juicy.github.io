import { useData, useRoute } from 'vitepress';
import { computed, Ref, ref, watch } from 'vue';
import { defineStore } from 'pinia';

import { mergeSimpleData } from '../utils/mergeData';

import type {
    SiteData
} from 'vitepress';
import type {
    ThemeConfig
} from '../types'
import type {
    SidebarConfig,
    NavItem,
    FooterItem,
    SocialLink
} from '../types/sidebar';

// @ts-ignore
import defaultAvatar from '../assets/avatar.svg';


interface NormalizeNavItem extends NavItem {
    tooltip?: string;
    highlight: { normal?: string, hover?: string, active?: string };
    items: NormalizeNavItem[];
    depth: number;
}

interface NormalizeFooterItem extends FooterItem {
    tooltip?: string;
    highlight: { normal?: string, hover?: string, active?: string };
}


const DEFAULT = {
    TITLE: "VitePress",
    LOGO: defaultAvatar,
    DESCRIPTION: "",
    ENABLEPROFILE: true,
    HIGHLIGHT: (path: string, allLinks: string[]) => {
        return allLinks
            .filter(link => path.startsWith(link))
            .sort((a, b) => b.length - a.length)[0];
    },
};


function imageValidator(input: any): boolean {
    return (typeof input === 'string') ||
        (typeof input === 'object' && input  && typeof input.src === 'string') ||
        (typeof input === 'object' && input  && typeof input.component === 'string');
}

function isNavItem(input: any): boolean {
    return (typeof input === 'object' && input !== null) &&
        (typeof input.text === 'string')
}

function isFooterItem(input: any): boolean {
    return (typeof input === 'object' && input !== null) &&
        (typeof input.text === 'string') &&
        (typeof input.link === 'string')
}

function isSocialLink(input: any): boolean {
    return (typeof input === 'object' && input !== null) &&
        (imageValidator(input.icon)) &&
        (typeof input.link === 'string')
}

function normalizeHighlight(input: any): { normal?: string, hover?: string, active?: string } {
    if (typeof input === 'string') {
        return { normal: input, hover: input, active: input };
    } else if (typeof input === 'object' && input !== null) {
        return {
            normal: typeof input.normal === 'string' ? input.normal : undefined,
            hover: typeof input.hover === 'string' ? input.hover : undefined,
            active: typeof input.active === 'string' ? input.active : undefined
        };
    } else {
        return { normal: undefined, hover: undefined, active: undefined };
    };
}

function normalizeNavItem<T extends NavItem>(input: T, depth: number = 0): NormalizeNavItem {
    const items = Array.isArray(input.items) && (depth < 5)
        ? input.items
            .filter((item) => isNavItem(item))
            .map((item) => normalizeNavItem(item, depth + 1))
        : [];
    return {
        text: input.text,
        link: typeof input.link === 'string' ? input.link : undefined,
        icon: imageValidator(input.icon) ? input.icon : undefined,
        tooltip: typeof input.tooltip === 'string'
            ? input.tooltip
            : (input.tooltip === false)
                ? undefined
                : input.text,
        highlight: normalizeHighlight(input.highlight),
        items,
        collapsed: typeof input.collapsed === 'boolean' ? input.collapsed : true,
        depth
    };
}

function normalizeFooterItem<T extends FooterItem>(input: T): NormalizeFooterItem {    
    return {
        text: input.text,
        link: input.link,
        icon: imageValidator(input.icon) ? input.icon : undefined,
        tooltip: typeof input.tooltip === 'string'
            ? input.tooltip
            : (input.tooltip === false)
                ? undefined
                : input.text,
        highlight: normalizeHighlight(input.highlight),
        showOnCollapsed: typeof input.showOnCollapsed === 'boolean' ? input.showOnCollapsed : true
    };
}


export const useVPJSidebar = defineStore('vpj-sidebar', () => {
    // Initialize sidebar config
    const { theme, site }: {
        theme: Ref<ThemeConfig>,
        site: Ref<SiteData>
    } = useData();
    const route = useRoute();

    const sidebarConfig: Ref<SidebarConfig> = ref(theme.value.sidebar || {});
    watch(theme, (next, prev) => {
        if (JSON.stringify(next) !== JSON.stringify(prev)) {
            sidebarConfig.value = theme.value.sidebar || {};
        };
    });

    // state
    const collapsed: Ref<boolean> = ref(
        typeof sidebarConfig.value.collapsed === 'boolean'
            ? sidebarConfig.value.collapsed
            : true
    );
    function toggle(): void { collapsed.value = !collapsed.value; };
    function close(): void { collapsed.value = true; };
    function open(): void { collapsed.value = false; };

    // Enable Sidebar?
    const enabled: Ref<boolean> = computed(() => sidebarConfig.value.enabled === undefined ? true : !!sidebarConfig.value.enabled)

    // Header Config
    const headerConfig = computed(() => {
        const imageValidator = (input: any) => (typeof input === 'string') ||
            (typeof input === 'object' && input  && typeof input.src === 'string') ||
            (typeof input === 'object' && input  && typeof input.component === 'string');

        // Calculate profile
        const profileConfig = (typeof sidebarConfig.value.profile === 'object' && sidebarConfig.value.profile !== null)
            ? sidebarConfig.value.profile
            : {};
        const enabled = mergeSimpleData((input: any) => typeof input === 'boolean', undefined,
            profileConfig.enabled,
            DEFAULT.ENABLEPROFILE
        );
        const title = mergeSimpleData(
            (input: any) => typeof input === 'string', undefined,
            profileConfig.title,
            site.value.title,
            DEFAULT.TITLE
        );
        const logo = mergeSimpleData(
            imageValidator, undefined,
            profileConfig.logo,
            theme.value.logo,
            DEFAULT.LOGO
        );
        const description = mergeSimpleData(
            (input: any) => (typeof input === 'string') ||
                (typeof input === 'object' && input !== null && typeof input.component === 'string'),
            undefined,
            profileConfig.description,
            site.value.description,
            DEFAULT.DESCRIPTION
        );
        const cardTitle = typeof profileConfig.cardTitle === 'string' ? profileConfig.cardTitle : title;
        const cardLogo = imageValidator(profileConfig.cardLogo) ? profileConfig.cardLogo : logo;
        const profile = { enabled, title, logo, cardTitle, cardLogo, description };

        return {
            profile
        };
    });

    // Nav Config
    const navConfig = computed(() => {
        // Caculate navLinks
        const navLinks: NormalizeNavItem[] = [];
        const navLinksConfig = sidebarConfig.value.navLinks;
        if (Array.isArray(navLinksConfig)) {
            navLinksConfig
                .filter(item => isNavItem(item))
                .forEach(item => navLinks.push(normalizeNavItem(item)));
        } else if (typeof navLinksConfig === 'object' && navLinksConfig !== null) {
            const basePaths = Object.keys(navLinksConfig).sort((a, b) => b.length - a.length);
            const curr = basePaths.find(basePath => route.path.startsWith(basePath));
            if (curr && Array.isArray(navLinksConfig[curr])) {
                navLinksConfig[curr]
                    .filter(item => isNavItem(item))
                    .forEach(item => navLinks.push(normalizeNavItem(item)));
            };
        };

        return {
            navLinks
        };
    });

    const footerConfig = computed(() => {
        // Calculate footerLinks
        const footerLinks: NormalizeFooterItem[] = [];
        const footerLinksConfig = sidebarConfig.value.footerLinks;
        if (Array.isArray(footerLinksConfig)) {
            footerLinksConfig
                .filter(item => isFooterItem(item))
                .forEach(item => footerLinks.push(normalizeFooterItem(item)));
        };

        const socialLinks: SocialLink[] = [];
        const socialLinksConfig = sidebarConfig.value.socialLinks;
        if (Array.isArray(socialLinksConfig)) {
            socialLinksConfig
                .filter(item => isSocialLink(item))
                .forEach(item => {
                    const normalized = {
                        icon: item.icon,
                        link: item.link,
                        ariaLabel: (typeof item.ariaLabel === 'string')
                            ? item.ariaLabel
                            : undefined,
                    };
                    socialLinks.push(normalized);
                });
        };

        return {
            footerLinks,
            socialLinks
        };
    });

    const highlight = computed(() => {
        const allLinks: string[] = [];
        const navItems = navConfig.value.navLinks;
        const footerItems = footerConfig.value.footerLinks;

        function register(item: NormalizeNavItem | NormalizeFooterItem) {
            if (item.link) allLinks.push(item.link)
            if ("items" in item && Array.isArray(item.items)) item.items.forEach(register);
        };

        navItems.forEach(register);
        footerItems.forEach(register);

        const highlightFunc = (typeof sidebarConfig.value.highlight === 'function')
            ? sidebarConfig.value.highlight
            : DEFAULT.HIGHLIGHT;
        
        try {
            const result = highlightFunc(route.path, allLinks);
            return (typeof result === 'string') ? result : undefined;
        } catch (e) {
            console.error(`[Juicy Theme]Fail to resolve sidebar highlight item: ${e}.`);
            return undefined;
        };
    });


    return {
        enabled,
        highlight,

        headerConfig,
        navConfig,
        footerConfig,

        collapsed,
        toggle,
        close,
        open
    };
});