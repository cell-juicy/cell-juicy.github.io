import { defineConfigWithTheme } from 'vitepress';
import type { ThemeConfig } from './theme/type';
import vueDevTools from 'vite-plugin-vue-devtools';


export default defineConfigWithTheme<ThemeConfig>({
    title: "Cell的个人站点",
    lang: "zh-CN",
    description: "Cell's personal site",
    themeConfig: {
        sidebar: {
            profileDescription: "这里是Cell的个人站点，记录了一些日常的学习心得，仍在建设中。",
            navLinks: [
                {icon: "VPJIconHome", text: "我的主页", link: "/", tooltip: "主页"},
                {icon: "VPJIconBlogPencil", text: "我的博客", link: "/blogs/", tooltip: "博客"},
                {icon: "VPJIconBookBookmark", text: "我的笔记", link: "/docs/", tooltip: "笔记"}
            ],
            footerLinks: [
                {icon: "VPJIconInfo", text: "关于我们", link: "/about/"}
            ]
        },
        layouts: {
            
        },
        blog: {
            tag: {
                textProcessor: (tag) => `# ${tag}`
            },
        },
        doc: {
            space: {
                "实分析": {
                    nodeMeta: {
                        global: {
                            inherit: true,
                            treeTitle(data) {
                                if (data.isVirtual) {
                                    return `第${data.order[0]}章`
                                } else {
                                    return data.title?.replace(/(\d+)\.(\d+)[^\S\r\n]*(.*)/, '$1.$2节 $3') || data.id;
                                }
                            },
                        },
                    },
                },
            },
            enableVirtual: true
        },
    },
    vite: {
        plugins: [
            // @ts-ignore
            vueDevTools()
        ]
    },
})
