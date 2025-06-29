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
                    enableVirtual: true,
                    github(ctx) {
                        const repository = "https://github.com/cell-juicy/Note-on-Tao-Zhexuan-real-analysis/tree/main/"
                        const title = ctx.layoutConfig.title?.replace(/\d+?\.\d+?\s+?(.*?)/, "$1")
                        const { order } = (ctx.layoutConfig.layout === "doc") ? ctx.layoutConfig : {order: [0]}
                        return {
                            url: `${repository}/第${order?.[0]}章/md/实分析 ${order?.join(".") || ""} ${title}.md`,
                            tooltip: "查看原始markdown文件"
                        }
                    },
                    nodeMeta: {
                        global: {
                            inherit: true,
                            treeTitle(data) {
                                if (data.isVirtual) {
                                    if (data.order[0] <= 11) return `上半部 第${data.order[0]}章`
                                    if (data.order[0] === 13) return `测试标题注入逻辑 (替换第${data.order[0]}章)`
                                    return `下半部 第${data.order[0]}章`
                                } else {
                                    return data.title?.replace(/(\d+)\.(\d+)[^\S\r\n]*(.*)/, '$1.$2节 $3') || data.id;
                                }
                            },
                            resources: {
                                book: {
                                    url: "/files/实分析（第3版）.pdf",
                                    label: "测试资源3（文件）"
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    vite: {
        plugins: [
            // @ts-ignore
            vueDevTools()
        ]
    },
})
