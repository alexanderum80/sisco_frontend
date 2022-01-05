export const compararExpresionesApi = {
    all: require('graphql-tag/loader!./all-comparar-expresiones.query.gql'),
    byId: require('graphql-tag/loader!./comparar-expresion-by-id.query.gql'),
    save: require('graphql-tag/loader!./save-comparar-expresion.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-comparar-expresion.mutation.gql'),
};
