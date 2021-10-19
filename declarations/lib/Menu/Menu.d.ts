export default class Menu {
    private menuItems;
    constructor(menuItems: MenuItem[]);
    private rlInterface;
    open(): void;
    close(): void;
    private stack;
    private index;
    getCurrent<T extends MenuItem = MenuItem>(): T;
}
declare type MenuItem = [
    MenuItemSubmenu,
    MenuItemValue,
    MenuItemCheckbox
][number];
interface _MenuItem<T extends MenuItemType> {
    name: string;
    type: T;
}
declare type MenuItemType = [
    "submenu",
    "value",
    "checkbox"
][number];
interface MenuItemSubmenu extends _MenuItem<"submenu"> {
    submenu: _MenuItem<MenuItemType>[];
}
interface MenuItemValue extends _MenuItem<"value"> {
    value: _MenuItem<MenuItemType>[];
}
interface MenuItemCheckbox extends _MenuItem<"checkbox"> {
    checked: boolean;
}
export {};
