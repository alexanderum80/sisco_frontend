export const conexionRodasApi = {
    all: require('graphql-tag/loader!./all-conta-conexiones.query.gql'),
    byDivision: require('graphql-tag/loader!./conta-conexiones-by-division.query.gql'),
    byId: require('graphql-tag/loader!./conta-conexion-by-id.query.gql'),
    estado: require('graphql-tag/loader!./estado-conta-conexion.query.gql'),
    save: require('graphql-tag/loader!./save-conta-conexion.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-conta-conexion.mutation.gql'),
};
