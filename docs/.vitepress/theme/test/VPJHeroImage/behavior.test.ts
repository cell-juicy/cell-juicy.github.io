import { mount } from '@vue/test-utils';
import { describe, test, expect, vi, afterEach } from 'vitest';
import { nextTick, ref } from 'vue';
import VPJHeroImage from '../../components/VPJHeroImage.vue';
import { VPJ_PAGE_LAYOUT_SYMBOL } from '../../utils/symbols';

// 模拟 vitepress
vi.mock('vitepress', () => ({
    useData: () => ({
        page: {
            value: {
                isNotFound: false,
                filePath: '/test.md'
            }
        }
    })
}));

// 模拟设备类型
vi.mock('../utils/deviceTypes', () => ({
    isDesktop: {
        value: true
    }
}));

// 模拟ClinentOnly
const ClientOnly = {
    setup(_, { slots }) {
        return () => slots.default?.();
    }
};

// 测试后清除mock
afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
});

// 基础挂载选项
const baseMountOptions = {
    global: {
        components: { ClientOnly },
        provide: {
            [VPJ_PAGE_LAYOUT_SYMBOL]: {
                computedGutter: ref('3rem'),
                computedWidth: ref('60rem')
            }
        }
    },
    props: { src: 'hero.jpg' }
};

// 创建布局容器
function createHeroContainer() {
    const container = document.createElement('div');
    container.className = 'vpj-layout-page__hero-iamge';
    document.body.appendChild(container);
    return container;
};

describe("VPJHeroImage 组件行为测试", () => {
    test('在非页面布局中使用时输出警告信息', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mount(VPJHeroImage, {
            ...baseMountOptions,
            global: {
                ...baseMountOptions.global,
                provide: {}
            }
        });

        await nextTick();
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                '[Juicy Theme Warn]: The VPJHeroImage component can only be used in a page layout'
            )
        );
        warnSpy.mockRestore();
    });

    test('响应 src 和 height props', async () => {
        const container = createHeroContainer();
        const wrapper = mount(VPJHeroImage, {
            ...baseMountOptions,
            props: {
                src: 'new-hero.jpg',
                height: '500px'
            }
        });

        await nextTick();
        const heroImage = container.querySelector<HTMLElement>('.vpj-hero-image');
        expect(getComputedStyle(heroImage!).height).toBe('500px');
        const bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
        expect(getComputedStyle(bgDiv!).backgroundImage).toBe('url("new-hero.jpg")');
    });

    test('响应 fade 和 bgCss props', async () => {
        const container = createHeroContainer();
        const wrapper = mount(VPJHeroImage, {
            ...baseMountOptions,
            props: {
                src: 'hero.jpg',
                fade: 0.5,
                bgCss: {
                    backgroundPosition: 'center top',
                    filter: 'blur(2px)'
                }
            }
        });

        await nextTick();
        const bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
        expect(bgDiv!.style.maskImage).toBe('linear-gradient(to top, transparent 0%, black 50%, black)');
        expect(bgDiv!.style.backgroundPosition).toBe('center top');
        expect(bgDiv!.style.filter).toBe('blur(2px)');
    });
    
    test('fade 边界值处理', async () => {
        const container = createHeroContainer();
        const wrapper = mount(VPJHeroImage, {
            ...baseMountOptions,
            props: { src: 'hero.jpg' }
        });
        
        // 小于0（0%，也就是不填入）
        await wrapper.setProps({ fade: -1 });
        await nextTick();
        let bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
        expect(bgDiv!.style.maskImage).toBeFalsy();
        
        // 等于0（不填入）
        await wrapper.setProps({ fade: 0 });
        await nextTick();
        bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
        expect(bgDiv!.style.maskImage).toBeFalsy();
        
        // 等于1（100%）
        await wrapper.setProps({ fade: 1 });
        await nextTick();
        bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
        expect(bgDiv!.style.maskImage).toContain('100%');
        
        // 大于1（100%）
        await wrapper.setProps({ fade: 1.5 });
        await nextTick();
        bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
        expect(bgDiv!.style.maskImage).toContain('100%');
        
        // 非数字值（0%，也就是不填入）
        await wrapper.setProps({ fade: 'invalid' });
        await nextTick();
        bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
        expect(bgDiv!.style.maskImage).toBeFalsy();
    });

    test('bgCss 优先级高于 fade', async () => {
        const container = createHeroContainer();
        const wrapper = mount(VPJHeroImage, {
            ...baseMountOptions,
            props: {
                src: 'hero.jpg',
                fade: 0.5,
                bgCss: {
                    maskImage: 'custom-mask',
                    backgroundPosition: 'left top'
                }
            }
        });

        await nextTick();
        let bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
        expect(bgDiv!.style.maskImage).toBe('custom-mask');
        expect(bgDiv!.style.backgroundPosition).toBe('left top');
        
        // bgCss中的maskImage始终优先于fade的滤镜
        await wrapper.setProps({ fade: 0.8 });
        await nextTick();
        bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
        expect(bgDiv!.style.maskImage).toBe('custom-mask');
        
        // 移除bgCss中的maskImage，fade生效
        await wrapper.setProps({ 
            bgCss: {
                backgroundPosition: 'left top'
            }
        });
        await nextTick();
        bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
        expect(bgDiv!.style.maskImage).toContain('80%');
    });

    test('布局配置的动态响应', async () => {
        // 创建可变的布局配置
        const computedGutter = ref('3rem');
        const computedWidth = ref('60rem');
        
        const container = createHeroContainer();
        const wrapper = mount(VPJHeroImage, {
            ...baseMountOptions,
            global: {
                ...baseMountOptions.global,
                provide: {
                    [VPJ_PAGE_LAYOUT_SYMBOL]: {
                        computedGutter,
                        computedWidth
                    }
                }
            }
        });
        
        // 初始验证
        await nextTick();
        let gridLayout = container.querySelector('.vpj-hero-image__grid-layout');
        let gridTemplateColumns = getComputedStyle(gridLayout!).gridTemplateColumns;
        expect(gridTemplateColumns).toContain('3rem');
        expect(gridTemplateColumns).toContain('60rem');
        
        // 更新布局配置
        computedGutter.value = '2rem';
        computedWidth.value = '70rem';
        await nextTick();
        
        // 验证更新
        gridLayout = container.querySelector('.vpj-hero-image__grid-layout');
        gridTemplateColumns = getComputedStyle(gridLayout!).gridTemplateColumns;
        expect(gridTemplateColumns).toContain('2rem');
        expect(gridTemplateColumns).toContain('70rem');
        expect(gridTemplateColumns).toContain('minmax');
    });

    test('属性更新触发连锁响应', async () => {
        const container = createHeroContainer();
        const wrapper = mount(VPJHeroImage, {
            ...baseMountOptions,
            props: { 
                src: 'initial.jpg',
                height: '300px'
            }
        });
        
        // 同时更新多个属性
        await wrapper.setProps({
            src: 'updated.jpg',
            height: '400px',
            fade: 0.7,
            bgCss: { 
                filter: 'blur(3px)',
                backgroundSize: 'contain'
            }
        });
        
        await nextTick();
        const heroImage = container.querySelector<HTMLElement>('.vpj-hero-image');
        const bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
        
        // 验证所有属性更新
        expect(heroImage!.style.height).toBe('400px');
        expect(bgDiv!.style.backgroundImage).toBe('url("updated.jpg")');
        expect(bgDiv!.style.maskImage).toContain('70%');
        expect(bgDiv!.style.filter).toBe('blur(3px)');
        expect(bgDiv!.style.backgroundSize).toBe('contain');
    });
});