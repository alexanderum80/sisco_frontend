import { IMenuItem } from './menu-item';

export interface IListItems {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface IActionItemClickedArgs {
    action: IMenuItem;
    item: IListItems;
}

export const ActionClicked = {
    Add: 'add',
    Edit: 'edit',
    Delete: 'delete',
    Save: 'save',
    Cancel: 'cancel',
    Yes: 'yes',
    No: 'no'
};
