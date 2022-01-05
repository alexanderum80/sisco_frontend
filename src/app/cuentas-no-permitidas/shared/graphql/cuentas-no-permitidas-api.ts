export const cuentasNoPermitidasApi = {
    all: require('graphql-tag/loader!./all-cuentas-no-permitidas.query.gql'),
    byId: require('graphql-tag/loader!./cuenta-no-permitida-by-id.query.gql'),
    save: require('graphql-tag/loader!./save-cuenta-no-permitida.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-cuenta-no-permitida.mutation.gql'),
};
