import { SweetalertService } from './../../shared/services/sweetalert.service';
import { ActionClicked } from './../../shared/models/list-items';
import { ModalService } from './../../shared/services/modal.service';
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
    private _epigrafesSvc: EpigrafesService,
    private _sweetalterSvc: SweetalertService
  ) { }

  ngOnInit(): void {
    this.fg = this._epigrafesSvc.fg;

    this.action = this.fg.controls['idEpigrafe'].value === 0 ? 'Agregar' : 'Modificar';
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
    try {
      this.subscription.push(this._epigrafesSvc.save().subscribe(response => {
        let result;
        let txtMessage;

        if (this.action === 'Agregar' ) {
          result = response.createEpigrafe;
          txtMessage = 'El Epígrafe se ha creado correctamente.';
        } else {
          result = response.updateEpigrafe;
          txtMessage = 'El Epígrafe se ha actualizado correctamente.';
        }
        
        if (!result.success) {
          return this._sweetalterSvc.error(result.error || '');
        }
  
        this._modalSvc.closeModal(txtMessage);
      }));
    } catch (err: any) {
      this._sweetalterSvc.error(err);
    }
  }

  private _closeModal(message?: string): void {
    this._modalSvc.closeModal(message);
  }

}
