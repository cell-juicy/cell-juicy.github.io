import { useData } from 'vitepress';
import { computed, Ref, ref, watch } from 'vue';
import { defineStore } from 'pinia';

import type { SidebarConfig } from '../type';

// @ts-ignore
import defaultAvatar from '../assets/avatar.svg';


export const useVPJSidebar = defineStore('vpj-sidebar', () => {
    // Initialize sidebar config
    const { theme, site } = useData();
    const sidebar: Ref<SidebarConfig> = ref(theme.value.sidebar || {});
    watch(theme, (next, prev) => {
        if (JSON.stringify(next) !== JSON.stringify(prev)) {
            sidebar.value = theme.value.sidebar;
        };   
    });
    const enabled = computed(() => {
        return sidebar.value.enable === undefined ? true : sidebar.value.enable
    });
    const headerConfig = computed(() => {
        return {
            logo: sidebar.value.headerLogo || theme.value.logo || defaultAvatar,
            title: sidebar.value.headerTitle || site.value.title || 'Vitepress'
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
        collapsed,
        toggle,
        close,
        open
    }
})