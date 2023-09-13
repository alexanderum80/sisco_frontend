import * as moment from 'moment';

export enum DateFormatEnum {
  US_DATE = 'MM/dd/yyyy',
  US_SHORT_DATE = 'MM/dd/yy',
  US_DATE_HOUR = 'MM/dd/yyyy HH:mm:ss',
  ES_DATE = 'dd/MM/yyyy',
  ES_SHORT_DATE = 'dd/MM/yy',
  ES_DATE_HOUR = 'dd/MM/yyyy HH:mm:ss',
  ES_DATE_HOUR_M = 'dd/MM/yyyy hh:mm:ss a',
}

export enum LocaleFormatEnum {
  EN_US = 'en_US',
  ES_US = 'es_US',
}

export const quarterMonths = {
  1: ['Jan', 'Feb', 'Mar'],
  2: ['Apr', 'May', 'Jun'],
  3: ['Jul', 'Aug', 'Sep'],
  4: ['Oct', 'Nov', 'Dec'],
};

export function getFirtsDateOfMonth(fecha: Date): Date {
  return moment(fecha).startOf('month').toDate();
}

export function getLastDateOfMonth(fecha: Date): Date {
  return moment(fecha).subtract(1, 'month').endOf('month').toDate();
}

export function getPreviousMonth(fecha: Date): Date {
  return moment(new Date(fecha.getFullYear(), fecha.getMonth(), 0))
    .startOf('month')
    .toDate();
}

export function getConciliacionMonth(fecha: Date): Date {
  return fecha.getDate() <= 5
    ? moment(new Date(fecha.getFullYear(), fecha.getMonth(), 0))
        .startOf('month')
        .toDate()
    : fecha;
}

export function getMonthName(month: number): string {
  let monthName: string = '';

  switch (month) {
    case 0:
      monthName = 'Apertura';
      break;
    case 1:
      monthName = 'Enero';
      break;
    case 2:
      monthName = 'Febrero';
      break;
    case 3:
      monthName = 'Marzo';
      break;
    case 4:
      monthName = 'Abril';
      break;
    case 5:
      monthName = 'Mayo';
      break;
    case 6:
      monthName = 'Junio';
      break;
    case 7:
      monthName = 'Julio';
      break;
    case 8:
      monthName = 'Agosto';
      break;
    case 9:
      monthName = 'Septiembre';
      break;
    case 10:
      monthName = 'Octubre';
      break;
    case 11:
      monthName = 'Noviembre';
      break;
    case 12:
      monthName = 'Diciembre';
      break;
    case 13:
      monthName = 'Cierre';
      break;
  }

  return monthName;
}

export function backInTime(date: Date, amount: any, timespan: string): Date {
  return moment(date).subtract(amount, timespan).toDate();
}
