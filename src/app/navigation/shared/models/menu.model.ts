export interface MenuItem {
    id: string;
    name: string;
    childrens: MenuItemChildren[];
}

export interface MenuItemChildren {
    id: string;
    name: string;
    icon: string;
    url: string;
    disabled: boolean;
    tooltip: string;
    adminAccess: boolean;
    childrens?: MenuItemChildren[];
}


export interface VerticalMenuItem {
    id: string;
    name: string;
    icon: string;
    disabled: boolean;
}
