import { Apollo } from 'apollo-angular';
import { NavigationService } from './../shared/services/navigation.service';
import { MenuItems } from './../shared/models/menu-items';
import { Component, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {

  menu: MenuItem[] = cloneDeep(MenuItems);

//   items: MegaMenuItem[] = [
//     {
//         label: 'Videos', icon: 'mdi mdi-file-video-outline',
//         items: [
//             [
//                 {
//                     label: 'Video 1',
//                     items: [{label: 'Video 1.1', routerLink: ['/concilia-golden-dwh']}, {label: 'Video 1.2'}]
//                 },
//                 {
//                     label: 'Video 2',
//                     items: [{label: 'Video 2.1'}, {label: 'Video 2.2'}]
//                 }
//             ],
//             [
//                 {
//                     label: 'Video 3',
//                     items: [{label: 'Video 3.1'}, {label: 'Video 3.2'}]
//                 },
//                 {
//                     label: 'Video 4',
//                     items: [{label: 'Video 4.1'}, {label: 'Video 4.2'}]
//                 }
//             ]
//         ]
//     },
//     {
//         label: 'Users', icon: 'pi pi-fw pi-users',
//         items: [
//             [
//                 {
//                     label: 'User 1',
//                     items: [{label: 'User 1.1'}, {label: 'User 1.2'}]
//                 },
//                 {
//                     label: 'User 2',
//                     items: [{label: 'User 2.1'}, {label: 'User 2.2'}]
//                 },
//             ],
//             [
//                 {
//                     label: 'User 3',
//                     items: [{label: 'User 3.1'}, {label: 'User 3.2'}]
//                 },
//                 {
//                     label: 'User 4',
//                     items: [{label: 'User 4.1'}, {label: 'User 4.2'}]
//                 }
//             ],
//             [
//                 {
//                     label: 'User 5',
//                     items: [{label: 'User 5.1'}, {label: 'User 5.2'}]
//                 },
//                 {
//                     label: 'User 6',
//                     items: [{label: 'User 6.1'}, {label: 'User 6.2'}]
//                 }
//             ]
//         ]
//     },
//   ];

  constructor(
    private _navigationSvc: NavigationService,
    private _apollo: Apollo
  ) { }

  ngOnInit(): void {
  }

  navigateTo(url: string): void {
    if (url !== '') {
      this._navigationSvc.navigateTo(url);
    }
  }

}
