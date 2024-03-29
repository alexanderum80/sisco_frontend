export const conexionRodasApi = {
  all: require('graphql-tag/loader!./all-conta-conexiones.query.gql'),
  byId: require('graphql-tag/loader!./conta-conexion-by-id.query.gql'),
  entidades: require('graphql-tag/loader!./entidades-rodas.query.gql'),
  create: require('graphql-tag/loader!./create-conta-conexion.mutation.gql'),
  update: require('graphql-tag/loader!./update-conta-conexion.mutation.gql'),
  delete: require('graphql-tag/loader!./delete-conta-conexion.mutation.gql'),
};
