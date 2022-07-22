import { IButtons } from '../ui/prime-ng/button/button.model';

export const DefaultInlineButtonsTable: IButtons[] = [
  {
    id: 'edit',
    label: '',
    icon: 'mdi mdi-18px mdi-pencil',
    class: 'p-button-rounded p-button-text p-button-warning',
    tooltip: 'Editar',
    tooltipPosition: 'left',
  },
  {
    id: 'delete',
    label: '',
    icon: 'mdi mdi-18px mdi-delete',
    class: 'p-button-rounded p-button-text p-button-danger',
    tooltip: 'Eliminar',
    tooltipPosition: 'left',
  },
];

export const DefaultTopLeftButtonsTable: IButtons[] = [
  {
    id: 'add',
    label: 'Nuevo',
    icon: 'pi pi-plus',
    class: 'p-button-success mr-2',
    tooltip: 'Agregar Nuevo',
    tooltipPosition: 'left',
  },
  {
    id: 'delete',
    label: 'Eliminar',
    icon: 'pi pi-trash',
    class: 'p-button-danger',
    tooltip: 'Eliminar seleccionado(s)',
    tooltipPosition: 'left',
  },
];
