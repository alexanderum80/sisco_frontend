export const tipoEntidadesApi = {
    all: require('graphql-tag/loader!./all-tipo-entidades.query.gql'),
    byId: require('graphql-tag/loader!./tipo-entidad-by-id.query.gql'),
    save: require('graphql-tag/loader!./save-tipo-entidad.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-tipo-entidad.mutation.gql'),
};
