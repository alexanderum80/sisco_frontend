export const compararValoresApi = {
    all: require('graphql-tag/loader!./all-comparar-valores.query.gql'),
    byId: require('graphql-tag/loader!./comparar-valor-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-comparar-valor.mutation.gql'),
    update: require('graphql-tag/loader!./update-comparar-valor.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-comparar-valor.mutation.gql'),
};
