export const clasificadorCnmbApi = {
  all: require('graphql-tag/loader!./all-clasificador-cnmb.query.gql'),
  byId: require('graphql-tag/loader!./clasificador-cnmb-by-id.query.gql'),
  save: require('graphql-tag/loader!./save-clasificador-cnmb.mutation.gql'),
  delete: require('graphql-tag/loader!./delete-clasificador-cnmb.mutation.gql'),
};
