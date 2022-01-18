export const tipoEntidadesApi = {
    all: require('graphql-tag/loader!./all-tipo-entidades.query.gql'),
    byId: require('graphql-tag/loader!./tipo-entidad-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-tipo-entidad.mutation.gql'),
    update: require('graphql-tag/loader!./update-tipo-entidad.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-tipo-entidad.mutation.gql'),
};
