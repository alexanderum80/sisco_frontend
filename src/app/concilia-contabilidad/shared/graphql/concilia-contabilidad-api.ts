export const conciliaContabilidadApi = {
  concilia: require('graphql-tag/loader!./concilia-contabilidad.query.gql'),
  inciarSaldo: require('graphql-tag/loader!./iniciar-saldos.mutation.gql'),
  chequearCentros: require('graphql-tag/loader!./chequear-centros.query.gql'),
};
