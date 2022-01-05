import SweetAlert from 'sweetalert2';
import { toNumber } from 'lodash';
import { MutationActions } from './../../shared/models/mutation-response';
import { FormGroup } from '@angular/forms';
import { MyErrorStateMatcher } from './../../angular-material/models/material-error-state-matcher';
import { Subscription } from 'rxjs';
import { ModalService } from './../../shared/services/modal.service';
import { MaterialService } from './../../shared/services/material.service';
import { TipoEntidadesService } from './../shared/services/tipo-entidades.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-tipo-entidades-form',
  templateUrl: './tipo-entidades-form.component.html',
  styleUrls: ['./tipo-entidades-form.component.scss']
})
export class TipoEntidadesFormComponent implements OnInit, OnDestroy {
  action: MutationActions;

  fg: FormGroup;

  matcher = new MyErrorStateMatcher();

  subscription: Subscription[] = [];

  constructor(
    private _modalSvc: ModalService,
    private _materialSvc: MaterialService,
    private _tipoEntidadesSvc: TipoEntidadesService
  ) { }

  ngOnInit(): void {
    this.fg = this._tipoEntidadesSvc.fg;
    this.action = toNumber(this.fg.controls['id'].value) === 0 ? 'Agregar' : 'Modificar';
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  save(): void {
    this.subscription.push(this._tipoEntidadesSvc.save().subscribe(response => {
      const result = response.saveTipoEntidad;
      if (!result.success) {
        return SweetAlert.fire({
          icon: 'error',
          title: 'ERROR',
          text: result.error,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar'
        });
      }

      let txtMessage;
      if (this.action === 'Agregar') {
        txtMessage = 'El Tipo de Entidad se ha creado correctamente.';
      } else {
        txtMessage = 'El Tipo de Entidad se ha actualizado correctamente.';
      }

      this.closeModal();

      this._materialSvc.openSnackBar(txtMessage);
    }));
  }

  closeModal(): void {
    this._modalSvc.closeModal();
  }

}
