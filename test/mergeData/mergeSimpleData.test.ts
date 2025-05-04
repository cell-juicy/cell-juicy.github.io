import { describe, test, expect } from 'vitest';
import { mergeSimpleData } from '../../docs/.vitepress/theme/utils/mergeData';

describe("mergeSimpleData 简单数据合并", () => {
    const isString = (input: any): input is string => typeof input === 'string';
    const isNumber = (input: any): input is number => typeof input === 'number';

    test("返回第一个有效值", () => {
        const result = mergeSimpleData(
            isString,
            "cancel", 
            undefined,
            "valid",
            "ignored"
        );
        expect(result).toBe("valid");
    });

    test("抑制值转换为 undefined", () => {
        const result = mergeSimpleData(
            isString,
            "cancel",
            "cancel",
            "fallback"
        );
        expect(result).toBeUndefined();
    });

    test("跳过未通过验证的值", () => {
        const result = mergeSimpleData(
            isNumber,
            0,
            "invalid",
            42
        );
        expect(result).toBe(42);
    });

    test("全无效输入", () => {
        const result = mergeSimpleData(
            isString,
            "cancel",
            undefined,
            123,
            false
        );
        expect(result).toBeUndefined();
    });

    test("抑制值不影响有效值", () => {
        const result = mergeSimpleData(
            isString,
            "cancel",
            "valid",
            "cancel"
        );
        expect(result).toBe("valid");
    });

    test("混合类型抑制逻辑", () => {
        const result = mergeSimpleData(
            // @ts-ignore 测试抑制逻辑
            (input): input is string | number => 
                typeof input === 'string' || typeof input === 'number',
            false,
            false,
            // @ts-ignore 测试抑制逻辑
            0,
            "backup"
        );
        expect(result).toBe(0);
    });
});