import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';


export const useVPJBlogLayout = defineStore('vpj-layout-blog', () => {
    // state
    const asideCollapsed: Ref<boolean> = ref(true);
    function asideToggle(): void {
        asideCollapsed.value = !asideCollapsed.value;
    };
    function asideClose(): void {
        asideCollapsed.value = true;
    };
    function asideOpen(): void {
        asideCollapsed.value = false;
    };
    

    return {
        asideCollapsed,
        asideToggle,
        asideClose,
        asideOpen
    }
})