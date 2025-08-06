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


export const useVPJSidebar = defineStore('vpj-sidebar', () => {
    // Initialize sidebar config
    const { theme, site }: {
        theme: Ref<ThemeConfig>,
        site: Ref<SiteData>
    } = useData();
    const route = useRoute();

    

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
        toggle,
        close,
        open
    }
})