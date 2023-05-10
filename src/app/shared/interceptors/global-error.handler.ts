import { ErrorHandler, Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (chunkFailedMessage.test(error.message)) {
      Swal.fire({
        icon: 'info',
        title: 'Nueva versión disponible',
        html: 'El SISCO se reiniciará para cargar la nueva versión.',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        html: error,
        confirmButtonText: 'Aceptar',
      });
      throw new Error(error);
    }
  }
}
