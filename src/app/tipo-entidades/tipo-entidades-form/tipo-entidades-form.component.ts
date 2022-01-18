import { ActionClicked } from './../../shared/models/list-items';
import SweetAlert from 'sweetalert2';
import { toNumber } from 'lodash';
import { MutationActions } from './../../shared/models/mutation-response';
import { FormGroup } from '@angular/forms';
import { MyErrorStateMatcher } from './../../angular-material/models/material-error-state-matcher';
import { Subscription } from 'rxjs';
import { ModalService } from './../../shared/services/modal.service';
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
    private _tipoEntidadesSvc: TipoEntidadesService
  ) { }

  ngOnInit(): void {
    this.fg = this._tipoEntidadesSvc.fg;
    this.action = toNumber(this.fg.controls['id'].value) === 0 ? 'Agregar' : 'Modificar';
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  onActionClicked(action: string) {
    switch (action) {
      case ActionClicked.Save:
        this._save();        
        break;
      case ActionClicked.Cancel:
        this._closeModal();
        break;
    }
  }

  private _save(): void {
    this.subscription.push(this._tipoEntidadesSvc.save().subscribe(response => {
      let result;
      let txtMessage;

      if (this.action === 'Agregar') {
        result = response.createTipoEntidad;
        txtMessage = 'El Tipo de Entidad se ha creado correctamente.';
      } else {
        result = response.updateTipoEntidad;
        txtMessage = 'El Tipo de Entidad se ha actualizado correctamente.';
      }
      
      if (!result.success) {
        return SweetAlert.fire({
          icon: 'error',
          title: 'ERROR',
          text: result.error,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar'
        });
      }

      this._closeModal(txtMessage);
    }));
  }

  private _closeModal(message?: string): void {
    this._modalSvc.closeModal(message);
  }

}
