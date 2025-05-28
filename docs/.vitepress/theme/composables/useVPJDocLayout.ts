import { useData } from 'vitepress';
import { Ref, ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

import { isMobile, isTablet } from '../utils/deviceTypes'
import {

} from '../utils/mergeData';

import { useDocData } from './useDocData';
import { CoverCssConfigData } from '../types/common';


const DEFAULT = {
    HEADERTITLETEMPLATE: ":space",
    HEADERICON: undefined,
    GITHUB: {
        tooltip: "在Github上查看"
    },
    PDF: {
        tooltip: "以pdf格式下载",
        download: true
    },
    MD: {
        tooltip: "以markdown格式下载",
        download: true
    },
    TOOLBAR: {},
    ASIDETABS: {
        
    },
    COVERALT: undefined,
    COVERHEIGHT: "240px",
    COVERFADE: undefined,
    COVERCSS: {
        objectFit: "cover",
        objectPosition: "center center"
    },
    CONTENTMARGINBOTTOM: "1.5rem",
    CONTENTMARGINTOP: "1.5rem",
    CONTENTMAXWIDTH: "760px",
    CONTENTPADDING: {
        mobile: "1rem",
        tablet: "2rem",
        desktop: "4rem"
    },
};

export const useVPJBlogLayout = defineStore('vpj-layout-blog', () => {
    // Initialize blog layout config
    const {
        frontmatter,
    }: {
        frontmatter: Ref<{[key: string]: any}>
    } = useData();
    
    const {
        ctx,
    } = useDocData();

    // Aside config
    const asideConfig = computed(() => {
        if (frontmatter.value.layout === "doc") {
            // Calculate aside tabs data
            
        };
        return undefined;
    });

    // Header config
    const headerConfig = computed(() => {
        if (frontmatter.value.layout === "doc") {
            // Calculate header title
            

            // Calculate header icon
            

            // Calculate github
            

            // Calculate pdf
           

            // Calculate md
            

            // Calculate toolbar button
            
        };
        return undefined;
    });

    // Content config
    const contentConfig = computed(() => {
        if (frontmatter.value.layout === "doc") {
            // Calculate margin bottom
            

            // Calculate margin top
            

            // Calculate max width
            

            // Calculate padding
            
        };
        return undefined;
    });

    // Cover config
    const coverConfig = computed(() => {
        if (frontmatter.value.layout === "doc") {
            // Calculate alt
            

            // Calculate fade
            

            // Calculate height
            

            // Calculate css
            
        };
        return undefined;
    });

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
        asideConfig,
        contentConfig,
        headerConfig,
        coverConfig,
        asideCollapsed,
        asideToggle,
        asideClose,
        asideOpen
    };
})