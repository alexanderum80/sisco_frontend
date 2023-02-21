export const usuariosApi = {
  authenticate: require('graphql-tag/loader!./authenticate.query.gql'),
  all: require('graphql-tag/loader!./all-usuarios.query.gql'),
  byDivision: require('graphql-tag/loader!./all-usuarios-by-division.query.gql'),
  byId: require('graphql-tag/loader!./usuario-by-id.query.gql'),
  changePassword: require('graphql-tag/loader!./change-password.mutation.gql'),
  create: require('graphql-tag/loader!./create-usuario.mutation.gql'),
  update: require('graphql-tag/loader!./update-usuario.mutation.gql'),
  delete: require('graphql-tag/loader!./delete-usuario.mutation.gql'),
};
