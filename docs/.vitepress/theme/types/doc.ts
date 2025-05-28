import {
    AsideTabInput,
    DeviceSpecificInput,
    CoverCssConfigInput,
    HeaderTitleTemplateInput,
    ToolbarGithubLinkInput,
    ToolbarDownloadInput,
    ToolbarButtonInput
} from "./common";

import {
    VPJDocLayoutConfig
} from "./layoutDoc"


export interface VirtualNodeMetadata {
    title?: string;
}

export interface SpaceDefaultData {

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

    virtualNodes: Record<string, VirtualNodeMetadata>;
}


export interface DocDefaultsConfig {

    space?: Record<string, SpaceDefaultData>;
}