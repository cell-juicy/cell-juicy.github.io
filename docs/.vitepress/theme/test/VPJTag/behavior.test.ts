import { mount } from '@vue/test-utils';
import { describe, test, expect } from 'vitest';
import VPJTag from '../../components/VPJTag.vue';


describe("VPJTag测试", () => {
    test("组件渲染", () => {
        const wrapper = mount(VPJTag, {
            props: {
                tag: 'something'
            }
        });

        const tag = wrapper.get('.vpj-blog-tag');

        expect(tag.text()).toBe('something');
    });
});