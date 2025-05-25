import { describe, test, expect } from 'vitest';
import { mergeToolbarButtonData } from '../../docs/.vitepress/theme/utils/mergeData';


describe("mergeToolbarButtonData 工具栏按钮合并", () => {
    test("基础合并优先级", () => {
        const mockCallback = () => {};
        const result = mergeToolbarButtonData(
            { 
                button1: { 
                    icon: "iconA", 
                    callback: mockCallback,
                    order: 1 
                } 
            },
            { 
                button1: { 
                    icon: "iconB", 
                    tooltip: "Tooltip B" 
                } 
            },
            { 
                button1: { 
                    callback: mockCallback, 
                    tooltip: "Tooltip C" 
                } 
            }
        );

        expect(result).toEqual({
            button1: { 
                icon: "iconA", 
                callback: mockCallback,
                tooltip: "Tooltip B",
                order: 1 
            } 
        });
    });

    test("简单输入转换与有效性过滤", () => {
        const someCallback = () => {}
        const result = mergeToolbarButtonData(
            { button2: "iconB" },
            { button2: { callback: someCallback } }
        );

        expect(result).toEqual({
            button2: {
                icon: "iconB",
                callback: someCallback,
                order: 0
            }
        });
    });

    test("非法输入过滤", () => {
        const result = mergeToolbarButtonData(
            // @ts-ignore 测试非法类型
            { button3: 123 },
            // @ts-ignore 测试非法结构
            { button3: { invalid: "object" } }
        );

        expect(result).toEqual({});
    });

    test("默认值与空配置处理", () => {
        const result = mergeToolbarButtonData(
            undefined,
            undefined,
            undefined,
            {}
        );

        expect(result).toEqual({});
    });

    test("混合有效性与最终过滤", () => {
        const validCallback = () => {};
        const result = mergeToolbarButtonData(
            { 
                button4: { 
                    icon: "iconD", 
                    callback: validCallback 
                } 
            },
            { 
                button4: { 
                    icon: false, 
                    callback: validCallback 
                } 
            },
            { 
                button4: { 
                    icon: "iconE", 
                    callback: undefined 
                } 
            }
        );

        expect(result).toEqual({
            button4: {
                icon: "iconD",
                callback: validCallback,
                order: 0,
                tooltip: undefined
            }
        });
    });
});