import { mount } from '@vue/test-utils';
import { describe, test, expect, vi, afterEach } from 'vitest';
import { nextTick, h } from 'vue';
import VPJHeroImage from '../../../components/VPJHeroImage.vue';
import { VPJ_PAGE_LAYOUT_SYMBOL } from '../../../utils/symbols';


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

// 测试后清除mock
afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
});

// 模拟ClinentOnly
const ClientOnly = {
    setup(_, { slots }) {
        return () => slots.default?.();
    }
};

// 模拟布局配置
const mockLayoutConfig = {
    computedGutter: { value: '3rem' },
    computedWidth: { value: '60rem' }
};

// 基础挂载选项
const baseMountOptions = {
    global: {
        components: { ClientOnly },
        provide: {
            [VPJ_PAGE_LAYOUT_SYMBOL]: mockLayoutConfig
        }
    }
};

// 创建传送容器
function createHeroContainer() {
    const container = document.createElement('div');
    container.className = 'vpj-layout-page__hero-iamge';
    document.body.appendChild(container);
    return container;
};


describe('VPJHeroImage 视图测试', () => {
    

    test('正确渲染背景样式', async () => {
        const container = createHeroContainer();
        mount(VPJHeroImage, {
            ...baseMountOptions,
            props: {
                src: 'hero.jpg',
                height: '400px',
                fade: 0.3,
                bgCss: {
                    backgroundPosition: 'left center',
                    filter: 'blur(2px)'
                }
            },
        });

        await nextTick();
        
        const bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
        expect(bgDiv).toBeTruthy();
        expect(bgDiv?.style.backgroundImage).toBe('url("hero.jpg")');
        expect(bgDiv?.style.maskImage).toContain('linear-gradient(to top, transparent 0%, black 30%, black)');
        expect(bgDiv?.style.backgroundPosition).toBe('left center');
        expect(bgDiv?.style.filter).toBe('blur(2px)');
    });

    test('使用自定义遮罩覆盖 fade 属性', async () => {
        const container = createHeroContainer();
        mount(VPJHeroImage, {
            ...baseMountOptions,
            props: {
                src: 'hero.jpg',
                fade: 0.3,
                bgCss: {
                    maskImage: 'custom-mask'
                }
            },
        });

        await nextTick();
        
        const bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
        expect(bgDiv?.style.maskImage).toBe('custom-mask');
    });

    test('渲染背景样式默认值', async () => {
        const container = createHeroContainer();
        mount(VPJHeroImage, {
            ...baseMountOptions,
            props: {
                src: 'hero.jpg',
            },
        });

        await nextTick();
        
        const bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');
  
        expect(bgDiv?.style.backgroundPosition).toBe('center center');
        expect(bgDiv?.style.backgroundSize).toBe('cover');
        expect(bgDiv?.style.backgroundRepeat).toBe('no-repeat');
    });

    test('部分覆盖背景样式默认值', async () => {
        const container = createHeroContainer();
        mount(VPJHeroImage, {
            ...baseMountOptions,
            props: {
                src: 'hero.jpg',
                bgCss: {
                    backgroundPosition: 'center top',
                    backgroundRepeat: 'repeat'
                }
            },
        });

        await nextTick();
        
        const bgDiv = container.querySelector<HTMLElement>('.vpj-hero-image__bg');

        expect(bgDiv?.style.backgroundPosition).toBe('center top');
        expect(bgDiv?.style.backgroundRepeat).toBe('repeat');
        expect(bgDiv?.style.backgroundSize).toBe('cover');
    });

    test('插槽内容在正确的网格位置', async () => {
        const container = createHeroContainer();
        mount(VPJHeroImage, {
            ...baseMountOptions,
            props: { src: 'hero.jpg' },
            slots: {
                default: h('div', { class: 'main-content' }, 'Main Content'),
                'padding-left': h('div', { class: 'left-widget' }, 'Left Widget'),
                'padding-right': h('div', { class: 'right-widget' }, 'Right Widget'),
            }
        });

        await nextTick();

        const gridLayout = container.querySelector('.vpj-hero-image__grid-layout');
        expect(gridLayout).toBeTruthy();

        const leftCol = gridLayout?.querySelector('.vpj-hero-image__padding-left');
        const contentCol = gridLayout?.querySelector('.vpj-hero-image__content');
        const rightCol = gridLayout?.querySelector('.vpj-hero-image__padding-right');
        
        expect(window.getComputedStyle(leftCol!).gridColumn).toBe('1');
        expect(window.getComputedStyle(contentCol!).gridColumn).toBe('2');
        expect(window.getComputedStyle(rightCol!).gridColumn).toBe('3');

        expect(leftCol?.querySelector('.left-widget')).toBeTruthy();
        expect(contentCol?.querySelector('.main-content')).toBeTruthy();
        expect(rightCol?.querySelector('.right-widget')).toBeTruthy();
    });

    test('计算网格布局参数 - 布局注入', async () => {
        const container = createHeroContainer();
        mount(VPJHeroImage, {
            ...baseMountOptions,
            props: { src: 'hero.jpg' },
        });

        await nextTick();
        
        const gridLayout = container.querySelector('.vpj-hero-image__grid-layout');
        expect(gridLayout).toBeTruthy();
        
        const gridTemplateColumns = window.getComputedStyle(gridLayout!).gridTemplateColumns;
        
        expect(gridTemplateColumns).toContain('3rem');
        expect(gridTemplateColumns).toContain('60rem');
        expect(gridTemplateColumns).toContain('minmax');
        
        if (gridTemplateColumns) {
            expect(gridTemplateColumns.includes('minmax(min(3rem, 100%), 1fr)')).toBe(true);
            expect(gridTemplateColumns.includes('minmax(min(calc(2 * 3rem), 100%), 60rem)')).toBe(true);
        }
    });
});