import { SweetalertService } from './../../shared/services/sweetalert.service';
import { DinamicDialogService } from './../../shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { ClasificadorCnmbService } from './../shared/services/clasificador-cnmb.service';
import { FormGroup } from '@angular/forms';
import { ActionClicked } from './../../shared/models/list-items';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clasificador-cnmb-form',
  templateUrl: './clasificador-cnmb-form.component.html',
  styleUrls: ['./clasificador-cnmb-form.component.scss'],
})
export class ClasificadorCnmbFormComponent implements OnInit {
  action: ActionClicked;
  fg: FormGroup;

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _clasificadorSvc: ClasificadorCnmbService,
    private _swalSvc: SweetalertService
  ) {}

  ngOnInit(): void {
    this.fg = this._clasificadorSvc.fg;

    this.action =
      this.fg.controls['cnmb'].value === ''
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
      this._clasificadorSvc.subscription.push(
        this._clasificadorSvc.save().subscribe({
          next: () => {
            let txtMessage;

            if (this.action === ActionClicked.Add) {
              txtMessage = 'El CNMB se ha creado correctamente.';
            } else {
              txtMessage = 'El CNMB se ha actualizado correctamente.';
            }

            this._closeModal(txtMessage);
          },
          error: err => {
            this._swalSvc.error(err);
          },
        })
      );
    } catch (err: any) {
      this._swalSvc.error(err);
    }
  }

  private _closeModal(message?: string): void {
    this._dinamicDialogSvc.close(message);
  }
}
