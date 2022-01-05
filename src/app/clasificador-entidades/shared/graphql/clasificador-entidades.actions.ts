export const clasificadorEntidadesApi = {
    all: require('graphql-tag/loader!./all-clasificador-entidades.query.gql'),
    by: require('graphql-tag/loader!./clasificador-entidad.query.gql'),
    save: require('graphql-tag/loader!./save-clasificador-entidad.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-clasificador-entidad.mutation.gql'),
};
