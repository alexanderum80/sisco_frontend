export const clasificadorCuentaApi = {
    all: require('graphql-tag/loader!./all-clasificador-cuenta.query.gql'),
    byTipo: require('graphql-tag/loader!./clasificador-cuenta.query.gql'),
    cuenta: require('graphql-tag/loader!./cuentas-agrupadas.query.gql'),
    save: require('graphql-tag/loader!./save-clasificador-cuenta.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-clasificador-cuenta.mutation.gql'),
};
