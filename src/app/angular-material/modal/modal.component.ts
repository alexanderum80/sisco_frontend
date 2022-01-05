import { FormGroup } from '@angular/forms';
import { ModalService } from '../../shared/services/modal.service';
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
    private _modalSvc: ModalService,
  ) { }

  ngOnInit(): void {
  }

  save(): void {
    this.saveClicked.emit(true);
  }

  closeModal(): void {
    this._modalSvc.closeModal();
  }

  isFormValid(): boolean {
    return this.fg && this.fg.valid;
  }

}
