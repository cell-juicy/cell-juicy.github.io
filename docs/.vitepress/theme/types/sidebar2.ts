import { ImageData } from "./common";


interface SidebarItem {
    text: string;
    link: string;
    icon?: ImageData | { component?: string };
    tooltip?: string;
    highlight?: string | { normal?: string; hover?: string; active?: string };
}

interface NavItem extends SidebarItem {
    items?: NavItem[]
    collapsed?: boolean;
}

interface FooterItem extends SidebarItem {
    showOnCollapse?: boolean;
}

interface SidebarProfile {
    buttonTitle?: string;
    buttonLogo?: string;
    cardTitle?: string;
    cardLogo?: string;
    description?: string;
    links?: SidebarItem[];
}

interface SocialLink {
    icon: ImageData | { component?: string };
    link: string;
    ariaLabel?: string;
}

export interface SidebarConfig {
    enable?: boolean;
    profile?: SidebarProfile;
    navLinks?:
        | NavItem[]
        | { [basePath: string]: NavItem[] };
    footerLinks?: FooterItem[];
    socialLinks?: SocialLink[];
}