import { DinamicDialogService } from 'src/app/shared/ui/prime-ng/dinamic-dialog/dinamic-dialog.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() title: string;
  @Input() fg: FormGroup;
  @Output() saveClicked = new EventEmitter<boolean>();

  constructor(
    private _dinamicDialogSvc: DinamicDialogService,
  ) { }

  ngOnInit(): void {
  }

  save(): void {
    this.saveClicked.emit(true);
  }

  closeModal(): void {
    this._dinamicDialogSvc.close();
  }

  isFormValid(): boolean {
    return this.fg && this.fg.valid;
  }

}
