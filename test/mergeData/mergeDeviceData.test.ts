import { describe, test, expect } from 'vitest';
import { mergeDeviceData } from '../../docs/.vitepress/theme/utils/mergeData';

describe("mergeDeviceData测试", () => {
    test("优先级规则测试", () => {
        const result = mergeDeviceData(
            { mobile: "200px", tablet: "250px" },
            { mobile: "100px", desktop: "300px" },
            { tablet: "150px", desktop: "400px" },
            { mobile: "50px", tablet: "50px", desktop: "50px" }
        );

        expect(result).toEqual({
            mobile: "200px",
            tablet: "250px",
            desktop: "300px"
        });
    });

    test("false禁用输入", () => {
        const result = mergeDeviceData(
            false,
            { mobile: "100px" },
            { desktop: "200px" }
        );

        expect(result).toEqual({
            mobile: undefined,
            tablet: undefined,
            desktop: undefined
        });
    });

    test("默认值应用", () => {
        const result = mergeDeviceData(
            undefined,
            undefined,
            undefined,
            {
                mobile: "1rem",
                tablet: "1rem",
                desktop: "4rem"
            }
        );

        expect(result).toEqual({
            mobile: "1rem",
            tablet: "1rem",
            desktop: "4rem"
        });
    });

    test("非法数据过滤", () => {
        const result = mergeDeviceData(
            // @ts-ignore
            123,
            { mobile: "666px", tablet: {obj: "error"}, desktop: false },
            { desktop: null },
            456,
            { tablet: "12rem", desktop: () => {}},
            { mobile: null, desktop: "90px" },
            null
        )

        expect(result).toEqual({
            mobile: "666px",
            tablet: "12rem",
            desktop: undefined
        })
    });
});