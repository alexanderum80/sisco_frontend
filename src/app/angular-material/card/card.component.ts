import { NavigationService } from 'src/app/navigation/shared/services/navigation.service';
import { ISelectableOptions } from './../../shared/models/selectable-item';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() avatar: any;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() menuValues: ISelectableOptions[] = [];

  @Output() clicked = new EventEmitter();

  constructor(
    private _navigationSvc: NavigationService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  get header(): boolean {
    return this.title !== null || this.subtitle !== null;
  }

  close(): void {
    this._navigationSvc.navigateTo('/');
  }

  onClick(action: any): void {
    this.clicked.emit(action);
  }

}
