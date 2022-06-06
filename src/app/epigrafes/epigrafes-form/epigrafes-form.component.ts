import { SweetalertService } from './../../shared/services/sweetalert.service';
import { ActionClicked } from './../../shared/models/list-items';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { EpigrafesService } from './../shared/services/epigrafes.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-epigrafes-form',
  templateUrl: './epigrafes-form.component.html',
  styleUrls: ['./epigrafes-form.component.scss'],
})
export class EpigrafesFormComponent implements OnInit {
  action: ActionClicked;

  fg: FormGroup;

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _epigrafesSvc: EpigrafesService,
    private _sweetalterSvc: SweetalertService
  ) {}

  ngOnInit(): void {
    this.fg = this._epigrafesSvc.fg;

    this.action =
      this.fg.controls['idEpigrafe'].value === 0
        ? ActionClicked.Add
        : ActionClicked.Edit;
  }

  onActionClicked(action: ActionClicked) {
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
      this._epigrafesSvc.subscription.push(
        this._epigrafesSvc.save().subscribe(response => {
          let result;
          let txtMessage;

          if (this.action === ActionClicked.Add) {
            result = response.createEpigrafe;
            txtMessage = 'El Epígrafe se ha creado correctamente.';
          } else {
            result = response.updateEpigrafe;
            txtMessage = 'El Epígrafe se ha actualizado correctamente.';
          }

          if (!result.success) {
            return this._sweetalterSvc.error(result.error || '');
          }

          this._dinamicDialogSvc.close(txtMessage);
        })
      );
    } catch (err: any) {
      this._sweetalterSvc.error(err);
    }
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}
