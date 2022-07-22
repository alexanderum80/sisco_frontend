import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    HttpClientModule,
    TooltipModule,
  ],
  exports: [FileUploadModule, FileUploadComponent],
})
export class PrimeFileUploadModule {}
