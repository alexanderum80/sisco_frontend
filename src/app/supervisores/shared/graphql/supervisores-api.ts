export const supervisoresApi = {
    all: require('graphql-tag/loader!./all-supervisores.query.gql'),
    byId: require('graphql-tag/loader!./supervisor-by-id.query.gql'),
    save: require('graphql-tag/loader!./save-supervisor.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-supervisor.mutation.gql')
};
