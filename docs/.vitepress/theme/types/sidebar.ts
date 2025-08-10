import { ImageData } from "./common";


interface SidebarItem {
    text: string;
    link?: string;
    icon?:
        | ImageData
        | { component?: string };
    tooltip?:
        | string
        | false;
    highlight?:
        | string
        | { normal?: string; hover?: string; active?: string };
}

export interface NavItem extends SidebarItem {
    items?: NavItem[]
    collapsed?: boolean;
}

export interface FooterItem extends SidebarItem {
    link: string;
    showOnCollapsed?: boolean;
}

interface SidebarProfile {
    enabled?: boolean;
    title?: string;
    logo?:
        | ImageData
        | { component?: string };
    cardTitle?: string;
    cardLogo?:
        | ImageData
        | { component?: string };
    description?:
        | string
        | { component?: string };
}

export interface SocialLink {
    icon:
        | ImageData
        | { component?: string };
    link: string;
    ariaLabel?: string;
}

export interface SidebarConfig {
    enabled?: boolean;
    profile?: SidebarProfile;
    highlight?: (path: string, allLinks: string[]) => string | undefined;
    navLinks?:
        | NavItem[]
        | { [basePath: string]: NavItem[] };
    footerLinks?: FooterItem[];
    socialLinks?: SocialLink[];
}