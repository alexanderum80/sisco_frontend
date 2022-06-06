export const clasificadorEntidadesApi = {
  all: require('graphql-tag/loader!./all-clasificador-entidades.query.gql'),
  by: require('graphql-tag/loader!./clasificador-entidad.query.gql'),
  create: require('graphql-tag/loader!./create-clasificador-entidad.mutation.gql'),
  update: require('graphql-tag/loader!./update-clasificador-entidad.mutation.gql'),
  delete: require('graphql-tag/loader!./delete-clasificador-entidad.mutation.gql'),
};
