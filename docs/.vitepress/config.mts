import { defineConfigWithTheme } from 'vitepress';
import path from 'node:path';

import type { ThemeConfig } from './theme/types';

import vueDevTools from 'vite-plugin-vue-devtools';
// import { visualizer } from 'rollup-plugin-visualizer';


const PROJECT_ROOT = path.resolve(__dirname, '../..');
const REPORT_DIR = path.join(PROJECT_ROOT, 'reports');


export default defineConfigWithTheme<ThemeConfig>({
    title: "Cell的个人站点",
    lang: "zh-CN",
    description: "Cell's personal site",
    themeConfig: {
        logo: "/assets/logo.svg",
        sidebar: {
            profile: {
                description: "这里是Cell的个人站点，记录了一些日常的学习心得，仍在建设中。"
            },
            navLinks: {
                "/": [
                    {icon: "VPJIconHome", text: "我的主页", link: "/", tooltip: "主页"},
                    {icon: "VPJIconBlogPencil", text: "我的博客", link: "/blogs/", tooltip: "博客"},
                    {icon: "VPJIconBookBookmark", text: "我的笔记", link: "/docs/", tooltip: "笔记"},
                ],
                "/docs/": [
                    {icon: "VPJIconHome", text: "我的主页", link: "/", tooltip: "主页"},
                    {icon: "VPJIconBlogPencil", text: "我的博客", link: "/blogs/", tooltip: "博客"},
                    {icon: "VPJIconBookBookmark", text: "我的笔记", link: "/docs/", tooltip: "笔记", collapsed: false,
                        items: [
                            {icon: "VPJIconBookBookmark", text: "实分析下", link: "/docs/Real-Analysis/Extra/", tooltip: "实分析（下半）（测试）"},
                            {icon: "VPJIconBookBookmark", text: "测试文档库", link: "/docs/book1/", tooltip: "测试book1"},
                        ],
                    },
                ],
                "/docs/Real-Analysis/": [
                    {icon: "VPJIconHome", text: "我的主页", link: "/", tooltip: "主页"},
                    {icon: "VPJIconBlogPencil", text: "我的博客", link: "/blogs/", tooltip: "博客"},
                    {icon: "VPJIconBookBookmark", text: "我的笔记", link: "/docs/", tooltip: "笔记", collapsed: false,
                        items: [
                            {icon: "VPJIconBookBookmark", text: "实分析下", link: "/docs/Real-Analysis/Extra/", tooltip: "实分析（下半）（测试）",
                                items: [
                                    {text: "第12章 度量空间", link: "/docs/Real-Analysis/Chap12/Sec1.html", tooltip: "第12章 度量空间"},
                                    {text: "第13章 度量空间上的连续函数", link: "/docs/Real-Analysis/Chap13/Sec1.html", tooltip: "第13章 度量空间上的连续函数"},
                                    {text: "第14章 一致收敛", link: "/docs/Real-Analysis/Chap14/Sec1.html", tooltip: "第14章 一致收敛"},
                                    {text: "第15章 幂级数", link: "/docs/Real-Analysis/Chap15/Sec1.html", tooltip: "第15章 幂级数"},
                                    {text: "第16章 傅里叶级数", link: "/docs/Real-Analysis/Chap16/Sec1.html", tooltip: "第16章 傅里叶级数"},
                                    {text: "第17章 多元微分学", link: "/docs/Real-Analysis/Chap17/Sec1.html", tooltip: "第17章 多元微分学"},
                                    {text: "第18章 勒贝格测度", link: "/docs/Real-Analysis/Chap18/Sec1.html", tooltip: "第18章 勒贝格测度"},
                                    {text: "第19章 勒贝格积分", link: "/docs/Real-Analysis/Chap19/Sec1.html", tooltip: "第19章 勒贝格积分"}
                                ]
                            },
                            {icon: "VPJIconBookBookmark", text: "测试文档库", link: "/docs/book1/", tooltip: "测试book1"},
                        ],
                    },
                ],
            },
            footerLinks: [
                {icon: "VPJIconInfo", text: "关于我们", link: "/about/"}
            ],
            socialLinks: [
                {icon: "VPJIconGithub", ariaLabel: "Cell's GitHub Profile", link: "https://github.com/cell-juicy/"},
            ]
        },
        layouts: {
            
        },
        blog: {
            "测试博客": {
                listTitle(data) {
                    return `测试替换${data.order}-${data.title}`
                }
            }
        },
        doc: {
            "实分析": {
                enableVirtual: true,
                github(ctx) {
                    const repository = "https://github.com/cell-juicy/Note-on-Tao-Zhexuan-real-analysis/tree/main"
                    const title = ctx.layoutConfig.title?.replace(/\d+?\.\d+?\s+?(.*?)/, "$1")
                    const { order } = (ctx.layoutConfig.layout === "doc") ? ctx.layoutConfig : {order: [0]}
                    const url = (order?.[0] === 100)
                        ? `${repository}/额外注释/md/额外注释.md`
                        : `${repository}/第${order?.[0]}章/md/实分析 ${order?.join(".") || ""} ${title}.md`
                    return {
                        url,
                        tooltip: "查看原始markdown文件"
                    }
                },
                nodeMeta: {
                    global: {
                        inherit: true,
                        resources: {
                            bookEn: {
                                url: "https://pan.quark.cn/s/f629e0fc4f6b",
                                label: "实分析原书下载（英文原版）",
                                type: "download"
                            },
                            bookZh: {
                                url: "https://pan.quark.cn/s/b6e896d0c74e",
                                label: "实分析原书下载（中文翻译版）",
                                type: "download"
                            },
                        },
                        treeTitle(data) {
                            return data.title?.replace(/(\d+)\.(\d+)[^\S\r\n]*(.*)/, '$1.$2节 $3') || data.id;
                        },
                    },
                    "1": {treeTitle: "第1章 引言"},
                    "2": {treeTitle: "第2章 从头开始：自然数"},
                    "3": {treeTitle: "第3章 集合论"},
                    "4": {treeTitle: "第4章 整数和有理数"},
                    "5": {treeTitle: "第5章 实数"},
                    "6": {treeTitle: "第6章 序列的极限"},
                    "7": {treeTitle: "第7章 级数"},
                    "8": {treeTitle: "第8章 无限集"},
                    "9": {treeTitle: "第9章 R上的连续函数"},
                    "10": {treeTitle: "第10章 函数的微分"},
                    "11": {treeTitle: "第11章 黎曼积分"},
                    "12": {treeTitle: "第12章 度量空间"},
                    "13": {treeTitle: "第13章 度量空间上的连续函数"},
                    "14": {treeTitle: "第14章 一致收敛"},
                    "15": {treeTitle: "第15章 幂级数"},
                    "16": {treeTitle: "第16章 傅里叶级数"},
                    "17": {treeTitle: "第17章 多元微分学"},
                    "18": {treeTitle: "第18章 勒贝格测度"},
                    "19": {treeTitle: "第19章 勒贝格积分"}
                },
            },
        },
        components: {
            tag: {
                format: (tag) => `# ${tag}`
            },
        }
    },
    vite: {
        plugins: [
            // @ts-ignore
            vueDevTools()
        ],
        // build: {
        //     rollupOptions: {
        //         plugins: [
        //             visualizer({
        //                 gzipSize: true,
        //                 brotliSize: true,
        //                 title: "VitePress Bundle Analysis",
        //                 filename: path.join(REPORT_DIR, "rollup_visualizer", "bundle-stats.html"), // 修改这里
        //                 projectRoot: PROJECT_ROOT,
        //                 open: true,
        //                 sourcemap: false,
        //                 template: 'treemap',
        //             })
        //         ]
        //     }
        // }
    },
    markdown: {
        math: true
    },
})
