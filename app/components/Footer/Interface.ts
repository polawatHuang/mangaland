export interface Root {
    success: boolean;
    message: string;
    result: Result;
    meta: Meta;
    status: number;
}

export interface Result {
    id: number;
    title: string;
    description: string;
    logo: string;
    favicon: string;
    timezone: string;
    theme: string;
    themeColors: ThemeColors;
    navbar: Navbar;
    footer: Footer;
    status: string;
    maintenanceTime: string;
    countdown: number;
    createdAt: string;
    updatedAt: string;
    menus: any[];
}

export interface ThemeColors {
    primary: string;
    secondary: string;
}

export interface Navbar {
    items: Item[];
}

export interface Item {
    link: string;
    title: string;
}

export interface Footer {
    about: About;
    contact: Contact;
    socials: Social[];
}

export interface About {
    para: string;
    title: string;
}

export interface Contact {
    email: Email;
    title: string;
}

export interface Email {
    href: string;
    name: string;
}

export interface Social {
    href: string;
    name: string;
}

export interface Meta {
    timestamp: string;
}
