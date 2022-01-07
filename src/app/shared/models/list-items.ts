export interface IActionItemClickedArgs {
    action: 'add' | 'edit' | 'delete' | 'save' | 'cancel' | 'yes' | 'no';
    item?: any;
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
