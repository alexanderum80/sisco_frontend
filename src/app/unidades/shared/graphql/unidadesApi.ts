export const unidadesApi = {
    all: require('graphql-tag/loader!./all-unidades.query.gql'),
    byIdSubdivision: require('graphql-tag/loader!./unidades-by-idSubdivision.query.gql'),
    byIdDivision: require('graphql-tag/loader!./unidades-by-idDivision.query.gql')
};
