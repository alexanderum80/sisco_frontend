export const conexionDWHApi = {
    byUnidad: require('graphql-tag/loader!./conexion-dwh.query.gql'),
    update: require('graphql-tag/loader!./update-conexion-dwh.mutation.gql')
};
