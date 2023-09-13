import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ActionClicked } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SweetalertService {
  constructor() {}

  success(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Satisfactorio',
      html: message,
      showConfirmButton: false,
      timer: 2000,
      allowOutsideClick: false,
    });
  }

  error(error: any): void {
    Swal.fire({
      icon: 'error',
      title: 'ERROR',
      html:
        typeof error === 'string'
          ? error.replace('Error: ', '')
          : error.graphQLErrors && error.graphQLErrors.length
          ? error.graphQLErrors[0]?.message.replace('Error: ', '')
          : error.message?.replace('Error: ', '') || error,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }

  async question(message: string, title = 'Confirmación'): Promise<string> {
    return Swal.fire({
      icon: 'question',
      title,
      html: message,
      confirmButtonText: 'Sí',
      showCancelButton: true,
      cancelButtonText: 'No',
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        return ActionClicked.Yes;
      } else {
        return ActionClicked.No;
      }
    });
  }

  info(message: string): void {
    Swal.fire({
      icon: 'info',
      title: 'Información',
      html: message,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }

  warning(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      html: message,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
}
