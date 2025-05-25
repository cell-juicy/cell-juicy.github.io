import { describe, test, expect } from 'vitest';
import { mergeHeaderTitleTemplateData } from '../../utils/mergeData';
import type { PageContext } from '../../types/common';

const blogContext: PageContext = {
    // @ts-ignore 测试用数据
    route: { path: '/blog', data: { title: '测试文章' } },
    layoutConfig: { layout: "blog", series: "技术专题", order: 2 }
};

const docContext: PageContext = {
    // @ts-ignore 测试用数据
    route: { path: '/doc', data: { title: 'API文档' } },
    layoutConfig: { layout: "doc", space: "核心模块", order: [1,2] }
};

describe("mergeHeaderTitleTemplateData 标题模板合并", () => {
    test("字符串模板替换", () => {
        const result = mergeHeaderTitleTemplateData(
            blogContext,
            ":series - :title (第:order篇)",
            undefined,
            ":series | :title"
        );

        expect(result).toBe("技术专题 - 测试文章 (第2篇)");
    });

    test("函数动态生成内容", () => {
        const result = mergeHeaderTitleTemplateData(
            docContext,
            ctx => ctx.layoutConfig.layout === "doc" 
                ? `${ctx.layoutConfig.space} - ${ctx.route.data.title}` 
                : false,
            "默认标题模板"
        );

        expect(result).toBe("核心模块 - API文档");
    });

    test("false显式禁用标题", () => {
        const result = mergeHeaderTitleTemplateData(
            blogContext,
            false,
            // @ts-ignore 测试
            (ctx) => `${ctx.series}专题`,
            "布局默认标题"
        );

        expect(result).toBeUndefined();
    });

    test("多级配置覆盖规则", () => {
        const result = mergeHeaderTitleTemplateData(
            blogContext,
            undefined,
            ":order.:title",
            "系列：:series"
        );

        expect(result).toBe("2.测试文章");
    });

    test("非法输入处理", () => {
        const result = mergeHeaderTitleTemplateData(
            blogContext,
            // @ts-ignore
            { invalid: "object" },
            // @ts-ignore
            12345,
            null
        );

        expect(result).toBeUndefined();
    });

    test("doc布局特殊替换", () => {
        const result = mergeHeaderTitleTemplateData(
            docContext,
            "空间：:space | 标题：:title",
            undefined,
            undefined
        );

        expect(result).toBe("空间：核心模块 | 标题：API文档");
    });
});