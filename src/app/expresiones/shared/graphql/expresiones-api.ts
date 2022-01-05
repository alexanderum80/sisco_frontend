export const expresionesApi = {
    allResumen: require('graphql-tag/loader!./all-expresiones-resumen.query.gql'),
    resumenById: require('graphql-tag/loader!./expresion-resumen-by-id.query.gql'),
    detalleByIdResumen: require('graphql-tag/loader!./expresion-detalle-by-idResumen.query.gql'),
    tipoValor: require('graphql-tag/loader!./all-tipovalor-expresiones.query.gql'),
    save: require('graphql-tag/loader!./save-expresion.mutation.gql'),
    deleteResumen: require('graphql-tag/loader!./delete-expresion-resumen.mutation.gql'),
};
