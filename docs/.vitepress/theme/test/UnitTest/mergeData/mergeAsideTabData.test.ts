import { describe, test, expect } from 'vitest';
import { mergeAsideTabData } from '../../../utils/mergeData';

describe("mergeAsideTabData 侧边栏标签合并", () => {
    test("基础合并逻辑", () => {
        const result = mergeAsideTabData(
            { 
                series: { name: "前端系列", component: "SeriesTab" },
                tags: { component: "TagsTab" }
            },
            {
                series: { order: 2 },
                categories: { component: "CategoriesTab" }
            },
            {
                series: { component: false },
                tags: { name: "技术标签" }
            }
        );

        expect(result).toEqual({
            series: { name: "前端系列", component: "SeriesTab", order: 2 },
            tags: { name: "技术标签", component: "TagsTab", order: 0 },
            categories: { name: "CategoriesTab", component: "CategoriesTab", order: 0 }
        });
    });

    test("false显式禁用组件", () => {
        const result = mergeAsideTabData(
            { 
                series: { component: "CustomSeries" },
                tags: false
            },
            {
                series: { component: "DefaultSeries" },
                tags: { name: "默认标签" }
            }
        );

        expect(result).toEqual({
            series: { name: "CustomSeries", component: "CustomSeries", order: 0 }
        });
    });

    test("简单输入转换", () => {
        const result = mergeAsideTabData(
            {
                series: "SeriesTab",
                tags: "TagsTab"
            },
            {
                tags: { order: 1 }
            }
        )

        expect(result).toEqual({
            series: { name: "SeriesTab", component: "SeriesTab", order: 0 },
            tags: { name: "TagsTab", component: "TagsTab", order: 1 }
        })
    })

    test("非法输入过滤", () => {
        const result = mergeAsideTabData(
            // @ts-ignore 测试非法类型
            { series: 123 },  
            { 
                // @ts-ignore 测试非法结构
                tags: { component: { invalid: "object" } }
            },
            null
        );

        expect(result).toEqual({});
    });

    test("默认排序处理", () => {
        const result = mergeAsideTabData(
            undefined,
            undefined,
            undefined,
            {
                series: {name: "系列", component: "VPJBlogAsideSeriesPage", order: 0},
                tags: {name: "标签", component: "VPJBlogAsideTagsPage", order: 0},
            }
        );

        expect(result).toEqual({
            series: { name: "系列", component: "VPJBlogAsideSeriesPage", order: 0 },
            tags: { name: "标签", component: "VPJBlogAsideTagsPage", order: 0 },
        });
    });
});