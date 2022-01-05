import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
  @Input() title: string;
  @Input() canAddItem = true;

  @Output() OnAddClicked = new EventEmitter();

  constructor(
    public usuarioSvc: UsuarioService,
  ) { }

  ngOnInit(): void {
  }

  add(): void {
    this.OnAddClicked.emit();
  }

}
