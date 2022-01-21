export const compararExpresionesApi = {
    all: require('graphql-tag/loader!./all-comparar-expresiones.query.gql'),
    byId: require('graphql-tag/loader!./comparar-expresion-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-comparar-expresion.mutation.gql'),
    update: require('graphql-tag/loader!./update-comparar-expresion.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-comparar-expresion.mutation.gql'),
};
