import {
    DeviceSpecificInput,
    NormalizedDeviceSpecificInput,
    CoverCssConfigInput,
    ToolbarGithubLinkInput,
    NormalizedToolbarGithubLinkInput,
    ToolbarDownloadInput,
    NormalizedToolbarDownloadInput,
    AsideTabInput,
    NormalizedAsideTabInput,
    HeaderTitleTemplateInput,
    ToolbarButtonInput,
    NormalizedToolbarButtonInput,
    PageContext
} from "./common";


export interface VPJDocLayoutConfig {

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
    

    coverCss?: CoverCssConfigInput;
    
 
    contentMarginBottom?: DeviceSpecificInput;
    

    contentMarginTop?: DeviceSpecificInput;
    
 
    contentPadding?: DeviceSpecificInput;
    

    contentMaxWidth?: DeviceSpecificInput;
}