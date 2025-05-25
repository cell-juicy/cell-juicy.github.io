import { describe, test, expect } from 'vitest';
import { mergeGithubLinkData } from '../../utils/mergeData';
import type { PageContext } from '../../types/common';

const mockContext: PageContext = {
    // @ts-ignore 测试用数据
    route: { path: '/test', data: { title: '测试页面' } },
    layoutConfig: { layout: "blog", series: "CSS精修系列" }
};

describe("mergeGithubLinkData GitHub链接合并", () => {
    test("基础优先级覆盖", () => {
        const result = mergeGithubLinkData(
            mockContext,
            "https://frontmatter.link",
            { url: "https://series.link", tooltip: "系列配置" },
            { url: "https://layout.link" }
        );

        expect(result).toEqual({
            url: "https://frontmatter.link",
            tooltip: "系列配置"
        });
    });

    test("函数动态生成配置", () => {
        const result = mergeGithubLinkData(
            mockContext,
            (ctx) => ({ 
                // @ts-ignore 测试
                url: ctx.layoutConfig.series ? `${ctx.layoutConfig.series}.md` : false,
                tooltip: `动态生成：${ctx.route.data.title}`
            }),
            "https://fallback.link"
        );

        expect(result).toEqual({
            url: "CSS精修系列.md",
            tooltip: "动态生成：测试页面"
        });
    });

    test("false显式禁用配置", () => {
        const result = mergeGithubLinkData(
            mockContext,
            false,
            { url: "https://series.link" },
            { url: "https://layout.link" }
        );

        expect(result).toEqual({
            url: undefined,
            tooltip: undefined
        });
    });

    test("字符串简写转换", () => {
        const result = mergeGithubLinkData(
            mockContext,
            "https://shortcut.link"  // 字符串简写
        );

        expect(result).toEqual({
            url: "https://shortcut.link",
            tooltip: undefined
        });
    });

    test("非法输入过滤", () => {
        const result = mergeGithubLinkData(
            mockContext,
            // @ts-ignore 测试非法类型
            { url: 12345 },  
            // @ts-ignore 测试非法结构
            { tooltip: { invalid: "object" } },
            null
        );

        expect(result).toEqual({});
    });

    test("默认值应用", () => {
            const result = mergeGithubLinkData(
            mockContext,
            undefined,
            undefined,
            {
                tooltip: "在Github上查看"
            }
        );

        expect(result).toEqual({
            url: undefined,
            tooltip: "在Github上查看"
        });
    });
});