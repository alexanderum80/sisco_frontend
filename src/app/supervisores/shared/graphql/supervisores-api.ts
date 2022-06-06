export const supervisoresApi = {
  all: require('graphql-tag/loader!./all-supervisores.query.gql'),
  byId: require('graphql-tag/loader!./supervisor-by-id.query.gql'),
  create: require('graphql-tag/loader!./create-supervisor.mutation.gql'),
  update: require('graphql-tag/loader!./update-supervisor.mutation.gql'),
  delete: require('graphql-tag/loader!./delete-supervisor.mutation.gql'),
};
