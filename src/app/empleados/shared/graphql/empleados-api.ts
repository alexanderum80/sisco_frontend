export const empleadosApi = {
    all: require('graphql-tag/loader!./all-empleados.query.gql'),
    byId: require('graphql-tag/loader!./empleado-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-empleado.mutation.gql'),
    update: require('graphql-tag/loader!./update-empleado.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-empleado.mutation.gql')
};
