export const conciliaExternaContaAPI = {
  datosConciliacion: require('graphql-tag/loader!./datosConciliacion.query.gql'),
  inicializarConciliacion: require('graphql-tag/loader!./inicializarConciliacion.mutation.gql'),
  cerrarConciliacion: require('graphql-tag/loader!./cerrarConciliacion.mutation.gql'),
  reabrirConciliacion: require('graphql-tag/loader!./reabrirConciliacion.mutation.gql'),
  conciliacion: require('graphql-tag/loader!./conciliacion.query.gql'),
  conciliacionResumen: require('graphql-tag/loader!./conciliacion-resumen.query.gql'),
  conciliacionPorEdades: require('graphql-tag/loader!./conciliacion-deudas-por-edades.query.gql'),
  conciliacionEntreUnidades: require('graphql-tag/loader!./conciliacionEntreUnidades.query.gql'),
  updateConciliaContab: require('graphql-tag/loader!./updateConciliaContab.mutation.gql'),
  updateConciliacionEntreUnidades: require('graphql-tag/loader!./updateConciliaEntreUnidades.mutation.gql'),
  diferenciasConciliacion: require('graphql-tag/loader!./diferenciasConciliacion.query.gql'),
  centrosNoConciliados: require('graphql-tag/loader!./centrosNoConciliados.query.gql'),
};
