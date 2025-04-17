import { AsideTabData, ToolbarButtonData, DeviceSpecificInput } from "./common";


/**
 * 
 */
export interface VPJBlogLayoutConfig {
    asideTabs?: AsideTabData[];

    headerTitleTemplate?: string;

    toolbar?: ToolbarButtonData[];

    cover?: string;

    coverAlt?: string;

    coverHeight?: DeviceSpecificInput;

    coverFade?: string;

    coverCss?: {

        boxShadow?: string;

        filter?: string;
        
        maskImage?: string;

        objectFit?: string;

        objectPosition?: string;

        opacity?: string;

        padding?: DeviceSpecificInput;

        transform?: string;

        transition?: string;
    };

    contentPadding?: DeviceSpecificInput;

    contentMaxWidth?: DeviceSpecificInput;
}