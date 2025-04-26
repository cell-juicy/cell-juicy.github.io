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

    github?: ToolbarGithubLinkInput;
    
    md?: ToolbarDownloadInput;
    
    pdf?: ToolbarDownloadInput;

    toolbar?: Record<string, ToolbarButtonInput>;

    cover?: string;

    coverAlt?: string;

    coverHeight?: DeviceSpecificInput;

    coverFade?:
        | string
        | number;

    coverCss?: CoverCssConfig;

    contentPadding?: DeviceSpecificInput;

    contentMaxWidth?: DeviceSpecificInput;
}