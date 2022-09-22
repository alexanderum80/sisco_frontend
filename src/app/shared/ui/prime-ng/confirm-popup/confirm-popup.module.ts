import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';

@NgModule({
    declarations: [],
    imports: [CommonModule, ConfirmPopupModule],
    exports: [ConfirmPopupModule],
    providers: [ConfirmationService],
})
export class PrimeConfirmPopupModule {}
