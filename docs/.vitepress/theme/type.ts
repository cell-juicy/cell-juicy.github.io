export type ImageData = string | { src: string; alt?: string };

export type NavItemData = {
    icon: ImageData | { component: string };
    text: string;
    link: string;
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
     * @defaultValue [] 默认情况下没有导航
     */
    navLinks?: NavItemData[];

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