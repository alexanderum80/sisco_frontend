export const EpigrafesApi = {
    all: require('graphql-tag/loader!./all-epigrafes.query.gql'),
    byId: require('graphql-tag/loader!./epigrafe-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-epigrafe.mutation.gql'),
    update: require('graphql-tag/loader!./update-epigrafe.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-epigrafe.mutation.gql'),
};
