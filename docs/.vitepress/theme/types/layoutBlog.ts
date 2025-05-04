import {
    DeviceSpecificInput,
    CoverCssConfig,
    ToolbarGithubLinkInput,
    ToolbarDownloadInput,
    AsideTabInput,
    HeaderTitleTemplateInput,
    ToolbarButtonInput
} from "./common";


/**
 * 
 */
export interface VPJBlogLayoutConfig {

    asideTabs?: Record<string, AsideTabInput>;

    headerTitleTemplate?: HeaderTitleTemplateInput;

    headerIcon?:
        | false
        | string
        | { component: string };

    github?: ToolbarGithubLinkInput;
    
    md?: ToolbarDownloadInput;
    
    pdf?: ToolbarDownloadInput;

    toolbar?: Record<string, ToolbarButtonInput>;

    cover?:
        | false
        | string;

    coverAlt?:
        | false
        | string;
    
    coverHeight?: DeviceSpecificInput;
    
    coverFade?:
        | false
        | string
        | number;
    
    coverCss?: CoverCssConfig;

    contentPadding?: DeviceSpecificInput;

    contentMaxWidth?: DeviceSpecificInput;
}