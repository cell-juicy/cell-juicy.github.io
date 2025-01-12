import { defineConfigWithTheme } from 'vitepress';
import type { ThemeConfig } from './theme/type';


export default defineConfigWithTheme<ThemeConfig>({
    title: "Cell的个人站点",
    lang: "zh-CN",
    description: "Cell's personal site",
    themeConfig: {
        sidebar: {
            profileDescription: "这里是Cell的个人站点，记录了一些日常的学习心得，仍在建设中。"
        }
    }
})
