export type ImageData = string | { src: string; alt?: string };

export type SidebarNavItemData = {
    /**
     * 侧边栏导航项的图标，可以是一个路径字符串或者一个组件，也可以通过对象指定图片的更多属性
     * @requires
     */
    icon:
        ImageData |
        { component: string };

    /**
     * 侧边栏导航项的文本，接受一个字符串
     * @requires
     */
    text: string;

    /**
     * 侧边栏导航项的链接，接受一个路径字符串
     * @requires
     */
    link: string;

    /**
     * 侧边栏导航项的提示文本，接受一个字符串作为弹出的提示文本，也可以设置为null来单独禁用某一项的提示文本
     * @optional
     * @defaultValue item.text 默认使用该项的文本作为提示文本
     */
    tooltip?:
        string |
        null;

    /**
     * 侧边栏导航项是否可以高亮，可以接受一个boolean值表示是否启用，也可以接受一个字符串或一个对象来指定高亮下图标的颜色（仅对使用svg图标的情况生效，对使用图片路径指定图标的项此设置无效）
     * @optional
     * @defaultValue true 默认启用高亮
     */
    highlight?:
        boolean |
        string |
        {normal?: string; hover?: string; active?: string};
};

export interface SidebarConfig {
    /**
     * 是否启用侧边栏，可以接受一个boolean值
     * @optional
     * @defalutValue true 默认为true
     */
    enable?: boolean;

    /**
     * 自定义侧边栏的标题，这将会被放置在侧边栏的顶部资料卡按钮中
     * @optional
     * @defaultValue site.title | "Vitepress" 默认从站点配置继承title
     */
    headerTitle?: string;

    /**
     * 自定义侧边栏资料卡按钮的logo，可以是一个路径字符串或者一个组件，也可以通过对象提供更多内容
     * @optional
     * @defaultValue theme.logo 默认从主题配置继承logo，若未配置则启用主题默认logo
     */
    headerLogo?: 
        ImageData |
        { component: string };

    /**
     * 是否启用侧边栏资料卡
     * @optional
     * @defaultValue true 默认为true
     */
    enableProfile?: boolean;
    
    /**
     * 自定义侧边栏资料卡的logo，可以是一个路径字符串或者一个组件，也可以通过对象提供更多内容
     * @optional
     * @defaultValue theme.sidebar.headerLogo 默认从侧边栏配置继承headerLogo
     */
    profileLogo?: 
        ImageData |
        { component: string };
    
    /**
     * 自定义侧边栏资料卡的标题
     * @optional
     * @defaultValue theme.sidebar.headerTitle 默认从侧边栏配置里面继承headerTitle
     */
    profileTitle?: string;

    /**
     * 自定义侧边栏资料卡的描述，接受一个字符串，也可以输入一个对象来指定使用一个已经在全局注册的组件名
     * @optional
     * @defaultValue site.description | "" 默认从站点配置继承description
     */
    profileDescription?: 
        string |
        { component: string };

    /**
     * 自定义侧边栏的导航项列表
     * @optional
     * @defaultValue [] 默认情况下没有导航项
     */
    navLinks?: SidebarNavItemData[];

    /**
     * 是否启用侧边栏导航项的提示文本，这会在侧边栏收起时为鼠标悬浮时显示一个提示，当设置为false时，将禁用所有导航项单独的tooltip配置
     * @optional
     * @defaultValue true 默认为启用提示文本，可以在navLinks中单独禁用或修改某项的tooltip配置
     */
    enableTooltip?: boolean;

    /**
     * 是否高亮当前页面最接近的父路径，这会为当前路由匹配到的最近父路径项的图标添加一个高亮样式。也可以输入一个接受函数来自定义高亮项的逻辑
     * @optional
     * @defaultValue true 默认为true
     */
    enableHighlight?:
        boolean |
        ((currentPath: string, navLinkList: string[]) => string | undefined);

    /**
     * 自定义侧边栏的额外内容，接受一个已经在全局注册的组件名，这将会被放置在导航栏下方的位置，并且仅在侧边栏展开时显示。
     * @optional
     */
    navContent?: string;
}


export interface ThemeConfig {
    /**
     * 自定义主题的logo，接受一个路径字符串，这会在作用于导航栏并且在一些组件中作为默认值提供
     * @optional
     */
    logo?: ImageData;

    /**
     * 侧边栏的配置项
     * @optional
     */
    sidebar?: SidebarConfig;
}