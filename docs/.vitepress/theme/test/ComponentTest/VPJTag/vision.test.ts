import { mount } from '@vue/test-utils';
import { describe, test, expect, vi, afterEach } from 'vitest';
import VPJTag from '../../components/VPJTag.vue';

// 测试后清除mock
afterEach(() => {
    vi.resetModules();
})

// 模拟vitepress(useData)空配置情景
vi.mock('vitepress', () => ({
    useData: () => ({
        theme: {
            value: {}
        }
    })
}));

describe("VPJTag 组件视图测试", () => {
    test("渲染原始标签文本", async() => {
        const wrapper = mount(VPJTag, {
            props: {
                tag: "标签",
            }
        });

        expect(wrapper.text()).toBe("标签");
    });

    test("使用自定义处理器格式化标签", () => {
        const wrapper = mount(VPJTag, {
            props: {
                tag: "标签",
                processor: (tag: string) => `#${tag}#`
            }
        });

        expect(wrapper.text()).toBe("#标签#");
    });

    test("使用主题默认处理器格式化标签", async () => {
        // 模拟主题配置
        vi.doUnmock('vitepress');
        vi.doMock('vitepress', () => ({
            useData: () => ({
                theme: {
                    value: {
                        blog: {
                            tag: {
                                textProcessor: (tag: string) => `# ${tag}`
                            }
                        }
                    }
                }
            })
        }));
        const { default: VPJTag } = await import('../../components/VPJTag.vue');

        const wrapper = mount(VPJTag, {
            props: {
                tag: "标签",
            }
        });

        expect(wrapper.text()).toBe("# 标签");
    });

    test("处理器优先级: 自定义 > 主题默认", async () => {
        // 模拟主题配置
        vi.doUnmock('vitepress');
        vi.doMock('vitepress', () => ({
            useData: () => ({
                theme: {
                    value: {
                        blog: {
                            tag: {
                                textProcessor: (tag: string) => `# ${tag}`
                            }
                        }
                    }
                }
            })
        }));
        const { default: VPJTag } = await import('../../components/VPJTag.vue');

        const wrapper = mount(VPJTag, {
            props: {
                tag: "标签",
                processor: (tag: string) => `#${tag}#`
            }
        });

        expect(wrapper.text()).toBe("#标签#");
    });

    test("处理器返回空字符串时回退到原始标签", () => {
        const wrapper = mount(VPJTag, {
            props: {
                tag: "标签",
                processor: () => ''
            }
        });

        expect(wrapper.text()).toBe("标签");
    });

    test("空标签处理", () => {
        const wrapper = mount(VPJTag, {
            props: {
                tag: "",
            }
        });

        expect(wrapper.text()).toBe("");
    });

    test("标签包含 HTML 时不渲染 HTML", () => {
        const wrapper = mount(VPJTag, {
            props: {
                tag: "<script>alert('hacked')</script>",
            }
        });

        expect(wrapper.text()).toBe("<script>alert('hacked')</script>");
    });
});