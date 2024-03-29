import { MenuItem } from 'primeng/api';

export const MenuItems: MenuItem[] = [
  {
    label: 'Sistemas',
    items: [
      {
        label: 'Parte Atrasos DWH',
        icon: 'mdi mdi-calendar-alert',
        routerLink: 'parte-atraso',
        disabled: false,
        title: 'Parte de Atrasos del Golden DWH.',
      },
      {
        label: 'Golden DWH',
        icon: 'mdi mdi-chart-bar',
        routerLink: 'concilia-golden-dwh',
        disabled: false,
        title: 'Concilia el Golden DWH con la Contabilidad.',
      },
      {
        label: 'Golden 2000',
        icon: 'mdi mdi-chart-bar-stacked',
        routerLink: '',
        disabled: true,
        title: 'Concilia el Golden2000 con la Contabilidad.',
      },
      { separator: true },
      {
        label: 'CashFlow',
        icon: 'mdi mdi-cash-usd-outline',
        routerLink: '',
        disabled: true,
        title: 'Concilia el CashFlow con la Contabilidad.',
      },
      {
        label: 'Parte Venta Unidad',
        icon: 'mdi mdi-cash',
        routerLink: '',
        disabled: true,
        title: 'Concilia el Parte de Venta de Unidad con la Contabilidad.',
      },
      {
        label: 'Parte Venta División',
        icon: 'mdi mdi-cash-multiple',
        routerLink: '',
        disabled: true,
        title: 'Concilia el Parte de Venta de División con la Contabilidad.',
      },
      { separator: true },
      {
        label: 'Activos Fijos Tangibles',
        icon: 'mdi mdi-home-city',
        routerLink: 'concilia-aft',
        disabled: true,
        title: 'Concilia los Activos Fijos con la Contabilidad.',
      },
      {
        label: 'Clasificadores AFT',
        items: [
          {
            label: 'Clasificador de Subgrupos',
            icon: 'mdi mdi-format-list-checkbox',
            routerLink: 'clasificador-subgrupos',
            disabled: false,
            title:
              'Clasificador de Subgrupos para activos fijos tangibles, solo lectura.  Es modificable solo en el departamento de contabilidad de la Empresa.',
          },
          {
            label: 'Arregla Clasificador de Subgrupos',
            icon: 'mdi mdi-format-list-checks',
            routerLink: '',
            disabled: true,
            title: 'Arregla Clasificador de Subgrupos de los Activos Fijos.',
          },
        ],
      },
      {
        label: 'Utiles y Herramientas',
        icon: 'mdi mdi-toolbox',
        routerLink: 'concilia-uh',
        disabled: false,
        title: 'Concilia los Útiles y Herramientas con la Contabilidad.',
      },
      { separator: true },
      {
        label: 'Nóminas',
        icon: 'mdi mdi-account-cash',
        routerLink: '',
        disabled: true,
        title: 'Concilia las Nóminas con la Contabilidad.',
      },
      { separator: true },
      {
        label: 'PC POS',
        icon: 'mdi mdi-cash-register',
        routerLink: '',
        disabled: true,
        title: 'Lectura de operaciones de las cinta de la las cajas PCPos.',
      },
      {
        label: 'Optimas',
        icon: 'mdi mdi-cash-register',
        routerLink: '',
        disabled: true,
        title: 'Lectura de operaciones de las cinta de la las cajas Optimas.',
      },
    ],
  },
  {
    label: 'Contabilidad',
    items: [
      {
        label: 'Contabilidad',
        icon: 'mdi mdi-book-open-page-variant',
        routerLink: 'concilia-contabilidad',
        disabled: false,
        title: 'Conciliar contabilidad.',
      },
      { separator: true },
      {
        label: 'Expresiones',
        icon: 'mdi mdi-book-open',
        routerLink: 'expresiones',
        disabled: false,
        title: 'Definición de expresiones con sus cuentas.',
      },
      {
        label: 'Comparaciones',
        icon: 'mdi mdi-code-equal',
        routerLink: 'comparar-expresiones',
        disabled: false,
        title: 'Establecer las expresiones a comparar.',
      },
      {
        label: 'Valores',
        icon: 'mdi mdi-numeric',
        routerLink: 'comparar-valores',
        disabled: false,
        title: 'Establecer valores de las expresiones.',
      },
      {
        label: 'No Permitidas',
        icon: 'mdi mdi-bookmark-off',
        routerLink: 'cuentas-no-permitidas',
        disabled: false,
        title: 'Cuentas no permitidas para la Entidad.',
      },
      { separator: true },
      {
        label: 'Estadísticas',
        icon: 'mdi mdi-book-information-variant',
        routerLink: 'estadistica',
        disabled: false,
        title: 'Muestra información sobre la gestión de los Centros.',
      },
      {
        label: 'Cuentas por Cobrar y Pagar',
        icon: 'mdi mdi-book-clock',
        routerLink: 'informe-cuentas-cobrar-pagar',
        disabled: false,
        title: 'Muestra Informe de Cuentas por Cobrar y Pagar.',
      },
      { separator: true },
      {
        label: 'Clasificadores',
        items: [
          {
            label: 'Clasificador de Cuentas',
            icon: 'mdi mdi-clipboard-text',
            routerLink: 'clasificador-cuenta',
            disabled: false,
            title:
              'Clasificador de cuentas, solo lectura.  Es modificable solo en el departamento de contabilidad de la Empresa.',
          },
          {
            label: 'Epígrafes',
            icon: 'mdi mdi-card-bulleted',
            routerLink: 'epigrafes',
            disabled: false,
            title:
              'Epígrafes de Gastos, solo lectura.  Es modificable solo en el departamento de contabilidad de la Empresa.',
          },
          {
            label: 'Elementos de Gastos',
            icon: 'mdi mdi-card-bulleted-settings',
            routerLink: 'elementos-gastos',
            disabled: false,
            title:
              'Elementos de Gastos, solo lectura.  Es modificable solo en el departamento de contabilidad de la Empresa.',
          },
          {
            label: 'Tipo de Entidades',
            icon: 'mdi mdi-home-group',
            routerLink: 'tipo-entidades',
            disabled: false,
            title:
              'Tipo de Entidades, solo lectura.  Es modificable solo en el departamento de contabilidad de la Empresa.',
          },
          {
            label: 'Clasificador de Entidades',
            icon: 'mdi mdi-home',
            routerLink: 'clasificador-entidades',
            disabled: false,
            title:
              'Clasificador de Entidades, solo lectura.  Es modificable solo en el departamento de contabilidad de la Empresa.',
          },
        ],
      },
      {
        label: 'Arregla Clasificador',
        icon: 'mdi mdi-flash-auto',
        routerLink: 'clasificador-cuenta/arreglar',
        disabled: false,
        title: 'Arregla Clasificador de Cuentas del Rodas.',
      },
    ],
  },
  {
    label: 'Conciliación',
    items: [
      {
        label: 'Golden DWH (Interna)',
        icon: 'mdi mdi-clipboard-text-outline',
        routerLink: 'concilia-interna-dwh',
        disabled: false,
        title: 'Conciliación Interna por el Golden DWH.',
      },
      {
        label: 'Contabilidad (Interna)',
        icon: 'mdi mdi-cash',
        routerLink: 'concilia-interna-conta',
        disabled: false,
        title: 'Conciliación Interna por la Contabilidad.',
      },
      { separator: true },
      {
        label: 'Golden DWH (Externa)',
        icon: 'mdi mdi-clipboard-text-multiple-outline',
        routerLink: 'concilia-externa-dwh',
        disabled: false,
        title: 'Conciliación Externa por el Golden DWH.',
      },
      {
        label: 'Contabilidad (Externa)',
        icon: 'mdi mdi-cash-multiple',
        routerLink: 'concilia-externa-conta',
        disabled: false,
        title: 'Conciliación Externa por la Contabilidad.',
      },
    ],
  },
  {
    label: 'Configuración',
    items: [
      {
        label: 'Conexiones',
        items: [
          {
            label: 'Rodas',
            icon: 'mdi mdi-bank',
            routerLink: 'conexion-rodas',
            disabled: false,
            title: 'Configurar la conexión a los Rodas.',
          },
          {
            label: 'Golden DWH',
            icon: 'mdi mdi-chart-bar',
            routerLink: 'conexion-dwh',
            disabled: false,
            title: 'Configurar la conexión al Golden DWH.',
          },
          {
            label: 'CashFlow',
            icon: 'mdi mdi-cash-usd-outline',
            routerLink: '',
            disabled: true,
            title: 'Configurar la conexión al CashFlow.',
          },
          {
            label: 'Nómina',
            icon: 'mdi mdi-account-cash',
            routerLink: '',
            disabled: true,
            title: 'Configurar la conexión a las Nóminas.',
          },
          {
            label: 'Parte de Ventas UC',
            icon: 'mdi mdi-cash',
            routerLink: '',
            disabled: true,
            title: 'Configurar la conexión al Parte de Ventas UC.',
          },
          {
            label: 'Parte de Ventas División',
            icon: 'mdi mdi-cash-multiple',
            routerLink: '',
            disabled: true,
            title: 'Configurar la conexión al Parte de Ventas División.',
          },
        ],
      },
      {
        label: 'Usuarios',
        icon: 'mdi mdi-account-multiple',
        routerLink: 'usuarios',
        disabled: false,
        title: 'Administrar Usuarios.',
      },
      {
        label: 'Empleados',
        icon: 'mdi mdi-account-tie',
        routerLink: 'empleados',
        disabled: false,
        title: 'Administrar Empleados.',
      },
      {
        label: 'Supervisores',
        icon: 'mdi mdi-account-supervisor-circle',
        routerLink: 'supervisores',
        disabled: false,
        title: 'Configurar Supervisores.',
      },
    ],
  },
];
