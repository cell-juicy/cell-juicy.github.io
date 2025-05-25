import { describe, test, expect } from 'vitest';
import { mergeCoverCssConfig } from '../../docs/.vitepress/theme/utils/mergeData';

describe("mergeCoverCssConfig测试", () => {
    test("基础优先级覆盖", () => {
        const result = mergeCoverCssConfig(
            { objectFit: "contain", filter: "blur(5px)" },
            { objectFit: "cover", opacity: "0.8" },
            { filter: "blur(2px)", opacity: "0.5" },
            { objectFit: "fill", transition: "all 0.3s" }
        );
        expect(result).toEqual({
            objectFit: "contain",
            filter: "blur(5px)",
            opacity: "0.8",
            transition: "all 0.3s"
        });
    });

    test("false显式禁用属性", () => {
        const result = mergeCoverCssConfig(
            { filter: false, opacity: "0.9" },
            { filter: "blur(2px)", objectFit: "cover" },
            { opacity: false }
        );
        expect(result).toEqual({
            filter: undefined,
            opacity: "0.9",
            objectFit: "cover"
        });
    });

    test("非法输入过滤", () => {
        const result = mergeCoverCssConfig(
            // @ts-ignore
            { objectFit: 123, filter: { invalid: "data" }, opacity: null },
            // @ts-ignore
            { transform: false, boxShadow: ["array"] },
            { maskImage: "valid-value" }
        );
        expect(result).toEqual({
            maskImage: "valid-value"
        });
    });

    test("默认空值应用", () => {
        const result = mergeCoverCssConfig(
            undefined,
            undefined,
            undefined,
            { transition: "none" }
        );
        expect(result).toEqual({
            transition: "none"
        });
    });
});