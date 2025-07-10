import { mount } from '@vue/test-utils';
import { describe, test, expect, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';

import VPJTag from '../../../components/VPJTag.vue';

const themeCallback = vi.fn((tag: string) => {});
const propsCallback = vi.fn((tag: string) => {});

// 测试后清除mock
afterEach(() => {
    vi.resetModules();
    themeCallback.mockClear();
    propsCallback.mockClear();
})

// 模拟vitepress(useData)空配置情景
vi.mock('vitepress', () => ({
    useData: () => ({
        theme: {
            value: {}
        }
    })
}));

describe("VPJTag 组件行为测试", () => {
    test("点击触发自定义回调", async () => {
        const wrapper = mount(VPJTag, {
            props: {
                tag: "标签",
                callback: propsCallback
            }
        });

        await wrapper.trigger("click");

        expect(propsCallback).toHaveBeenCalledWith("标签");
    });

    test("点击触发主题默认回调", async () => {
        // 模拟主题配置
        vi.doUnmock('vitepress');
        vi.doMock('vitepress', () => ({
            useData: () => ({
                theme: {
                    value: {
                        blog: {
                            tag: {
                                defaultCallback: themeCallback
                            }
                        }
                    }
                }
            })
        }));
        const { default: VPJTag } = await import('../../../components/VPJTag.vue');

        const wrapper = mount(VPJTag, {
            props: {
                tag: "标签",
            }
        });

        await wrapper.trigger("click");

        expect(themeCallback).toHaveBeenCalledWith("标签");
    });

    test("回调函数优先级: 自定义 > 主题默认", async () => {
        // 模拟主题配置
        vi.doUnmock('vitepress');
        vi.doMock('vitepress', () => ({
            useData: () => ({
                theme: {
                    value: {
                        blog: {
                            tag: {
                                defaultCallback: themeCallback
                            }
                        }
                    }
                }
            })
        }));
        const { default: VPJTag } = await import('../../../components/VPJTag.vue');

        const wrapper = mount(VPJTag, {
            props: {
                tag: "标签",
                callback: propsCallback
            }
        });

        await wrapper.trigger("click");

        expect(themeCallback).not.toHaveBeenCalledWith("标签");
        expect(propsCallback).toHaveBeenCalledWith("标签");
    });

    test("点击阻止事件冒泡", async () => {
        const parentHandler = vi.fn();
        const childHandler = vi.fn();
        const wrapper = mount({
            template: `
                <div @click="parentHandler">
                    <VPJTag tag="标签" :callback="childHandler"/>
                </div>
            `,
            components: {
                VPJTag
            },
            setup() {
                return {
                    parentHandler,
                    childHandler
                }
            }
        })

        await wrapper.findComponent(VPJTag).trigger("click");

        expect(parentHandler).not.toHaveBeenCalled();
        expect(childHandler).toHaveBeenCalledWith("标签");
    });

    test("点击阻止默认行为", async () => {
        const wrapper = mount(VPJTag, {
            props: {
                tag: "标签",
                callback: propsCallback
            },
            attachTo: document.body
        });

        // 创建模拟事件
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true
        });
        
        // 添加事件监听器
        const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
        
        // 触发事件
        await wrapper.get('button').element.dispatchEvent(clickEvent);
        
        // 验证 preventDefault 被调用
        expect(preventDefaultSpy).toHaveBeenCalled();
    });
});