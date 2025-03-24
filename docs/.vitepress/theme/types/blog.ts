import { AsideTabData } from "./common";


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
         * 标签文本处理函数 
         * @example (text) => `#${text}`
         */
        textProcessor?: (text: string) => string;
    };
  
    /** 系列（Series）全局默认配置 */
    series?: {
        /** 
         * 按系列名称配置的默认值 
         * @key 系列名称（需与 frontmatter 中的 series 字段匹配）
         */
        [seriesName: string]: {

            cover?: string;

            github?: string;

            download?: string;

            pdf?: string;

            presetTags?: string[];

            asideTabs: AsideTabData[];
        };
    };
  }