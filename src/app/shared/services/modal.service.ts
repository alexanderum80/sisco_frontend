import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    private _config = {
        disableClose: true
    };

    constructor(
        private _dialog: MatDialog
    ) {}

    openModal(component: any): void {
        this._dialog.open(component, this._config);
    }

    closeModal(): void {
        this._dialog.closeAll();
    }
}
