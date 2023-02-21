export interface IActionItemClickedArgs {
  action: 'add' | 'edit' | 'delete' | 'save' | 'cancel' | 'yes' | 'no';
  item?: any;
}

export enum ActionClicked {
  Add = 'add',
  Edit = 'edit',
  Delete = 'delete',
  Save = 'save',
  Accept = 'accept',
  Cancel = 'cancel',
  Yes = 'yes',
  No = 'no',
}
