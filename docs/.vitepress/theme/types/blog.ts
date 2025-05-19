import {
    AsideTabInput,
    DeviceSpecificInput,
    CoverCssConfigInput,
    HeaderTitleTemplateInput,
    ToolbarGithubLinkInput,
    ToolbarDownloadInput,
    ToolbarButtonInput
} from "./common";


export interface SeriesDefaultData {

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

    presetTags?: string[];
}

/**
 * 
 */
export interface BlogDefaultsConfig {
    /** 标签全局默认配置 */
    tags?: {
        /** 
         * 默认点击回调函数 
         * @param tag - 当前点击的标签文本
         */
        defaultCallback?: (tag: string) => void;
        
        /** 
         * 默认的标签文本处理函数
         */
        textProcessor?: (text: string) => string;
    };
  
    /** 系列（Series）全局默认配置 */
    series?: {
        /** 
         * 按系列名称配置的默认值 
         * @key 系列名称（需与 frontmatter 中的 series 字段匹配）
         */
        [seriesName: string]: SeriesDefaultData;
    };
  }