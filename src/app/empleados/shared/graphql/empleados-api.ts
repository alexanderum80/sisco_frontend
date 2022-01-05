export const empleadosApi = {
    all: require('graphql-tag/loader!./all-empleados.query.gql'),
    byId: require('graphql-tag/loader!./empleado-by-id.query.gql'),
    save: require('graphql-tag/loader!./save-empleado.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-empleado.mutation.gql')
};
