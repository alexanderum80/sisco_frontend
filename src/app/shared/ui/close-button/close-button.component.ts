import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/navigation/shared/services/navigation.service';

@Component({
  selector: 'app-close-button',
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.scss']
})
export class CloseButtonComponent implements OnInit {
  @Input() title: string;

  constructor(
    private _navigationSvc: NavigationService
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this._navigationSvc.navigateTo('');
  }

}
