export const elementosGastosApi = {
  all: require('graphql-tag/loader!./all-elementos-gastos.query.gql'),
  byId: require('graphql-tag/loader!./elemento-gasto-by-id.query.gql'),
  save: require('graphql-tag/loader!./save-elemento-gasto.mutation.gql'),
  delete: require('graphql-tag/loader!./delete-elemento-gasto.mutation.gql'),
};
