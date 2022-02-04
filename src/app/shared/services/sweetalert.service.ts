import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ActionClicked } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  constructor() { }

  success(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Satisfactorio',
      text: message,
      showConfirmButton: false,
      timer: 2000
    });
  }

  error(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'ERROR',
      text: message,
      confirmButtonText: 'Aceptar'
    });
  }

  async question(message: string): Promise<string> {
    return Swal.fire({
      icon: 'question',
      title: 'Confirmación',
      text: message,
      confirmButtonText: 'Sí',
      showCancelButton: true,
      cancelButtonText: 'No'
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
      text: message,
      confirmButtonText: 'Aceptar',
    });
  }

  warning(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: message,
      confirmButtonText: 'Aceptar',
    });
  }

}
