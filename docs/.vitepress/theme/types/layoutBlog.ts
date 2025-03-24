import { AsideTabData } from "./common";


/**
 * 
 */
export interface VPJBlogLayoutConfig {
    asideTabs?: AsideTabData[];

    coverHeight?: string;

    coverFade?: string;

    coverCss?: {

        boxShadow?: string;

        filter?: string;
        
        maskImage?: string;

        objectFit?: string;

        objectPosition?: string;

        opacity?: string;

        padding?: string;

        transform?: string;

        transition?: string;
    };

    contentPadding?: string;

    contentMaxWidth?: string;
}