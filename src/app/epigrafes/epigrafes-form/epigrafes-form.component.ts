import { ModalService } from './../../shared/services/modal.service';
import { MaterialService } from './../../shared/services/material.service';
import SweetAlert from 'sweetalert2';
import { MutationActions } from './../../shared/models/mutation-response';
import { EpigrafesService } from './../shared/services/epigrafes.service';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-epigrafes-form',
  templateUrl: './epigrafes-form.component.html',
  styleUrls: ['./epigrafes-form.component.scss']
})
export class EpigrafesFormComponent implements OnInit, OnDestroy {
  action: MutationActions;
  fg: FormGroup;

  subscription: Subscription[] = [];

  constructor(
    private _modalSvc: ModalService,
    private _materialSvc: MaterialService,
    private _epigrafesSvc: EpigrafesService
  ) { }

  ngOnInit(): void {
    this.fg = this._epigrafesSvc.fg;

    this.action = this.fg.controls['idEpigrafe'].value === 0 ? 'Agregar' : 'Modificar';
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  save(): void {
    this.subscription.push(this._epigrafesSvc.save().subscribe(response => {
      const result = response.saveEpigrafe;
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

      if (this.action === 'Agregar' ) {
        txtMessage = 'El Epígrafe se ha creado correctamente.';
      } else {
        txtMessage = 'El Epígrafe se ha actualizado correctamente.';
      }

      this._modalSvc.closeModal();

      this._materialSvc.openSnackBar(txtMessage);
    }));
  }

}
