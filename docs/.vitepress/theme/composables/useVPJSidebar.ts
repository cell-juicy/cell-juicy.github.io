import { useData, useRoute } from 'vitepress';
import { computed, Ref, ref, watch } from 'vue';
import { defineStore } from 'pinia';

import type {
    SiteData
} from 'vitepress';
import type {
    ThemeConfig
} from '../types'
import type {
    SidebarConfig,
    SidebarNavItemData,
    SidebarFooterItemData
} from '../types/sidebar';

// @ts-ignore
import defaultAvatar from '../assets/avatar.svg';


function normalizePath(id: string): string {
    /*
    @vpj-error-note(not solved)
    If you try to import normalizePath from vite, an error will be raised:Uncaught SyntaxError: Identifier '__vite__injectQuery' has already been declared (at ${mod.id}:40607:1)
    */
    return id.replace(/\\/g, '/');
}

function getNavHighlightFunc(
    input: boolean |
        (
            (currentPath: string, navLinkList: string[]) => string | undefined
        )
) {
    if (typeof input === 'function') return input;

    return (currentPath: string, navLinkList: string[]) => {
        const normalizeCurrent = normalizePath(currentPath);
        const parentLinkList = navLinkList
            .map(normalizePath)
            .filter((path) => {
                return normalizeCurrent.startsWith(path)
            })
            .sort((a: string, b: string): number => b.length - a.length);
        return parentLinkList.length > 0 ? parentLinkList[0] : undefined;
    }
}


export const useVPJSidebar = defineStore('vpj-sidebar', () => {
    // Initialize sidebar config
    const {
        theme,
        site
    }: {
        theme: Ref<ThemeConfig>,
        site: Ref<SiteData>
    } = useData();
    const route = useRoute();

    const sidebar: Ref<SidebarConfig> = ref(theme.value.sidebar || {});
    watch(theme, (next, prev) => {
        if (JSON.stringify(next) !== JSON.stringify(prev)) {
            sidebar.value = theme.value.sidebar || {};
        };   
    });
    const enabled = computed(() => {
        return sidebar.value.enable === undefined ? true : sidebar.value.enable
    });

    // Header config
    const headerConfig = computed(() => {
        return {
            logo: sidebar.value.headerLogo || theme.value.logo || defaultAvatar,
            title: sidebar.value.headerTitle || site.value.title || 'VitePress'
        }
    })
    const profileConfig = computed(() => {
        return {
            enabled: sidebar.value.enableProfile === undefined ? true : sidebar.value.enableProfile,
            logo: sidebar.value.profileLogo || headerConfig.value.logo,
            title: sidebar.value.profileTitle || headerConfig.value.title,
            description: sidebar.value.profileDescription || site.value.description || ''
        }
    })

    // Nav config
    const navConfig = computed(() => {
        const invalidAttrsKeys = [
            'class',
            'data-tooltip',
            'highlight',
            'href',
            'icon',
            'iconAttrs',
            'isLink',
            'link',
            'style',
            'text',
            'textAttrs',
            'tooltip'
        ];
        return {
            links: Array.isArray(sidebar.value.navLinks) ? sidebar.value.navLinks?.filter((item: SidebarNavItemData) => {
                    return item.link !== undefined &&
                        item.text !== undefined &&
                        item.icon !== undefined;
                }).map((raw: SidebarNavItemData) => {
                    const item = {...raw};
                    // initialize tooltip
                    if (item.tooltip === undefined) {
                        item.tooltip = item.text;
                    }
                    // initialize highlight
                    if (item.highlight === undefined) {
                        item.highlight = {};
                    } else if (item.highlight === true) {
                        item.highlight = {};
                    } else if (typeof item.highlight === 'string') {
                        item.highlight = {
                            normal: item.highlight,
                            hover: item.highlight,
                            active: item.highlight
                        };
                    }
                    // inistialize attrs
                    if (item.attrs === undefined || typeof item.attrs !== 'object') {
                        item.attrs = {};
                    } else {
                        const attrsCopy = {...item.attrs};
                        invalidAttrsKeys.forEach((key) => {
                            if (attrsCopy[key]) {
                                console.log(
                                    `Invalid attribute attrs key "${key}" in sidebar nav item({link:${item.link},` +
                                    `text: ${item.text}, ...}), please check your input.`
                                );
                                delete attrsCopy[key];
                            }
                        });
                        item.attrs = attrsCopy;
                    };
                    return item;
                }) || []
                : [],
            content: sidebar.value.navContent,
            tooltip: sidebar.value.enableTooltip === undefined ? true : sidebar.value.enableTooltip,
        }
    })
    const highlightConfig = sidebar.value.enableHighlight === undefined ? true : sidebar.value.enableHighlight;
    let highlightFunc: (currentPath: string, navLinkList: string[]) => string | undefined;
    if (typeof highlightConfig === 'function') {
        highlightFunc = highlightConfig;
    } else if (highlightConfig === true) {
        highlightFunc = getNavHighlightFunc(true);
    } else {
        highlightFunc = () => undefined;
    }
    const highlightPath = computed(() => {
        if (route.data.isNotFound) return undefined;
        return highlightFunc(
            route.path,
            navConfig.value.links.map((item: SidebarNavItemData): string => item.link)
        );
    });

    // Footer config
    const footerConfig = computed(() => {
        const invalidAttrsKeys = [
            'class',
            'href',
            'icon',
            'iconAttrs',
            'isLink',
            'link',
            'style',
            'text',
            'textAttrs'
        ];
        return {
            show: sidebar.value.showFooterOnCollapse === undefined ? false : sidebar.value.showFooterOnCollapse,
            links: Array.isArray(sidebar.value.footerLinks) ? sidebar.value.footerLinks?.filter((item) => {
                    return item.link !== undefined &&
                        item.text !== undefined &&
                        item.icon !== undefined;
                }).map((raw: SidebarFooterItemData) => {
                    // inistialize attrs
                    let attrsCopy: Record<string, any> = {target: '_blank'};
                    if (typeof raw.attrs === 'object') {
                        attrsCopy = {...raw.attrs};
                        invalidAttrsKeys.forEach((key) => {
                            if (attrsCopy[key]) {
                                console.log(
                                    `Invalid attribute attrs key "${key}" in sidebar footer item({link:${raw.link},` +
                                    `text: ${raw.text}, ...}), please check your input.`
                                );
                                delete attrsCopy[key];
                            }
                        });
                    };
                    return {
                        link: raw.link,
                        text: raw.text,
                        icon: raw.icon,
                        showOnCollapse: raw.showOnCollapse === undefined ? true : raw.showOnCollapse,
                        attrs: attrsCopy
                    };
                }) || []
                : [],
        };
    })

    // state
    const collapsed: Ref<boolean> = ref(true);
    function toggle(): void {
        collapsed.value = !collapsed.value;
    };
    function close(): void {
        collapsed.value = true;
    };
    function open(): void {
        collapsed.value = false;
    };

    return {
        enabled,
        headerConfig,
        profileConfig,
        navConfig,
        highlightPath,
        footerConfig,
        collapsed,
        toggle,
        close,
        open
    }
})