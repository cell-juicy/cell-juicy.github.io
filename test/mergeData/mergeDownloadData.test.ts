import { describe, test, expect } from 'vitest';
import { mergeDownloadData } from '../../docs/.vitepress/theme/utils/mergeData';
import type { PageContext } from '../../docs/.vitepress/theme/types/common';


// 模拟页面上下文
const mockContext: PageContext = {
    route: { 
        path: '/test',
        // @ts-ignore 测试用数据
        data: { title: 'Test Page' } 
    },
    layoutConfig: { layout: "doc", space: "demo", order: [1] }
};

describe("mergeDownloadData 下载按钮合并", () => {
    test("基础字段优先级合并", () => {
        const result = mergeDownloadData(
            mockContext,
            { url: "/file1.pdf", target: "_blank" },
            { url: "/file2.pdf", tooltip: "下载文件", download: true },
            { target: "_self", tooltip: false }
        );

        expect(result).toEqual({
            url: "/file1.pdf",
            target: "_blank",
            tooltip: "下载文件",
            download: true
        });
    });

    test("false抑制与undefined转换", () => {
        const result = mergeDownloadData(
            mockContext,
            { url: false, tooltip: "初始提示" },
            { url: "/final.pdf", tooltip: false }
        );

        expect(result).toEqual({
            url: undefined,
            tooltip: "初始提示"
        });
    });

    test("字符串简写转换", () => {
        const result = mergeDownloadData(
            mockContext,
            "/simple-url.pdf",
            { tooltip: "简洁下载" }
        );

        expect(result).toEqual({
            url: "/simple-url.pdf",
            tooltip: "简洁下载"
        });
    });

    test("函数输入解析", () => {
        const dynamicConfig = (ctx: PageContext) => ({
            // @ts-ignore 测试
            url: `${ctx.layoutConfig.space}.pdf`,
            download: ctx.layoutConfig.layout === "doc"
        });

        const result = mergeDownloadData(
            mockContext,
            dynamicConfig,
            { target: "_blank" }
        );

        expect(result).toEqual({
            url: "demo.pdf",
            download: true,
            target: "_blank"
        });
    });

    test("非法输入过滤", () => {
        const result = mergeDownloadData(
            mockContext,
            // @ts-ignore 测试非法类型
            12345,
            // @ts-ignore 测试非法结构
            { invalidKey: "shouldBeIgnored" },
            null
        );

        expect(result).toEqual({});
    });

    test("默认值与空配置", () => {
        const result = mergeDownloadData(
            mockContext,
            undefined,
            undefined,
            undefined,
            {
                tooltip: "以markdown格式下载",
                download: true
            }
        );

        expect(result).toEqual({
            tooltip: "以markdown格式下载",
            download: true
        });
    });
});