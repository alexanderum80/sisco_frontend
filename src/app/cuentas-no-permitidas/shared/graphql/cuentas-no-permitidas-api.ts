export const cuentasNoPermitidasApi = {
    all: require('graphql-tag/loader!./all-cuentas-no-permitidas.query.gql'),
    byId: require('graphql-tag/loader!./cuenta-no-permitida-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-cuenta-no-permitida.mutation.gql'),
    update: require('graphql-tag/loader!./update-cuenta-no-permitida.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-cuenta-no-permitida.mutation.gql'),
};
