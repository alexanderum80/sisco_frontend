import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  cantNotificaciones: number;

  constructor() { }

  ngOnInit(): void {

    setTimeout(() => {
      this.cantNotificaciones = 5;
    }, 500);
  }

}
