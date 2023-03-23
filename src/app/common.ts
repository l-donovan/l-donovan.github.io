export interface DesktopConfiguration {
    icon: string;
    title: string;
}

export interface WindowConfiguration {
    icon: string;
    title: string;
    content: string;
}

export interface Program {
    desktop: DesktopConfiguration;
    window: WindowConfiguration;
}