export const clasificadorSubgruposApi = {
  all: require('graphql-tag/loader!./all-clasificador-subgrupos.query.gql'),
  byId: require('graphql-tag/loader!./clasificador-subgrupos-by-id.query.gql'),
  save: require('graphql-tag/loader!./save-clasificador-subgrupos.mutation.gql'),
  delete: require('graphql-tag/loader!./delete-clasificador-subgrupos.mutation.gql'),
};
