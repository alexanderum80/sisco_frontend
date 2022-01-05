export const EpigrafesApi = {
    all: require('graphql-tag/loader!./all-epigrafes.query.gql'),
    byId: require('graphql-tag/loader!./epigrafe-by-id.query.gql'),
    save: require('graphql-tag/loader!./save-epigrafe.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-epigrafe.mutation.gql'),
};
