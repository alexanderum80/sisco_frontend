import { SweetalertService } from './../../shared/helpers/sweetalert.service';
import { ClasificadorSubgruposService } from './../shared/services/clasificador-subgrupos.service';
import { ActionClicked } from './../../shared/models/list-items';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';

@Component({
  selector: 'app-clasificador-subgrupos-form',
  templateUrl: './clasificador-subgrupos-form.component.html',
  styleUrls: ['./clasificador-subgrupos-form.component.scss'],
})
export class ClasificadorSubgruposFormComponent implements OnInit {
  action: ActionClicked;
  fg: FormGroup;

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
    private _clasificadorSvc: ClasificadorSubgruposService,
    private _swalSvc: SweetalertService
  ) {}

  ngOnInit(): void {
    this.fg = this._clasificadorSvc.fg;

    this.action =
      this.fg.controls['grupo'].value === ''
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
              txtMessage = 'El Subgrupo se ha creado correctamente.';
            } else {
              txtMessage = 'El Subgrupo se ha actualizado correctamente.';
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
