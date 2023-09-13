export const clasificadorCuentaApi = {
  // clasificador de cuentas
  all: require('graphql-tag/loader!./all-clasificador-cuenta.query.gql'),
  byTipo: require('graphql-tag/loader!./clasificador-cuenta.query.gql'),
  cuenta: require('graphql-tag/loader!./cuentas-agrupadas.query.gql'),
  save: require('graphql-tag/loader!./save-clasificador-cuenta.mutation.gql'),
  delete: require('graphql-tag/loader!./delete-clasificador-cuenta.mutation.gql'),
  arregla: require('graphql-tag/loader!./arregla-clasificador-cuenta.mutation.gql'),

  // nomencladores de las cuentas
  grupoCuenta: require('graphql-tag/loader!./all-grupo-cuenta.query.gql'),
  claseCuenta: require('graphql-tag/loader!./clase-cuenta-by-grupo.query.gql'),
  categoriaCuenta: require('graphql-tag/loader!./categoria-cuenta-by-clase.query.gql'),
};
