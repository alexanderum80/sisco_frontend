import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    ref: DynamicDialogRef;

    constructor(
        public dialogSvc: DialogService, public messageSvc: MessageService
    ) {}

    openModal(header: string, component: any): void {
        this.ref = this.dialogSvc.open(component, {
            header: header,
            closable: false,
            style: {"max-width": "90%" },
            contentStyle: {"max-height": "90%", "overflow": "inherit"},
            baseZIndex: 1000
        });
    }

    closeModal(message?: string): void {
        this.ref.close(message || null);
    }
}
