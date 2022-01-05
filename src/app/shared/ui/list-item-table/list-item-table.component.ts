import { IMenuItem } from './../../models/menu-item';
import { IListItems, IActionItemClickedArgs } from './../../models/list-items';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-item-table',
  templateUrl: './list-item-table.component.html',
  styleUrls: ['./list-item-table.component.scss']
})
export class ListItemTableComponent implements OnInit {
  @Input() items: IListItems[];
  @Input() menuItems: IMenuItem[];

  @Output() OnClicked = new EventEmitter<IActionItemClickedArgs>();
  @Output() OnAddClicked = new EventEmitter<IActionItemClickedArgs>();

  constructor() { }

  ngOnInit(): void {
  }

  onClicked(event: any, item: any): void {
    this.OnClicked.emit({
      item,
      action: event.id,
    });
  }

}
