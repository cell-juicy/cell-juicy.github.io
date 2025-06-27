import type {
    AsideTabInput,
    DeviceSpecificInput,
    CoverCssConfigInput,
    HeaderTitleTemplateInput,
    ToolbarGithubLinkInput,
    ToolbarDownloadInput,
    ToolbarButtonInput,
    ResourceInput,
} from "./common";

import type {
    VPJDocLayoutConfig
} from "./layoutDoc";

import type {
    DocPageData
} from "../composables/useDocData"


export interface NodeMetadata {
    title?: string;
    cover?: string | false;
    resources?: Record<string, ResourceInput>;
    inherit?: boolean;
    treeTitle?:
        | string
        | ((data: DocPageData) => string);
}

export interface SpaceMetaData {

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

    nodeMeta?: {

        global?: NodeMetadata;

        [orderString: string]: NodeMetadata | undefined;
    }
}


export interface DocDefaultsConfig {

    space?: Record<string, SpaceMetaData>;

    enableVirtual?: boolean;
}