import { UsuarioInfoComponent } from './usuario-info/usuario-info.component';
// import { MoreVertComponent } from './more-vert/more-vert.component';
// import { TopMenuComponent } from './top-menu/top-menu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { PrimeButtonModule } from '../shared/ui/prime-ng/button/button.module';

@NgModule({
  declarations: [
    // TopMenuComponent,
    // MoreVertComponent,
    UsuarioInfoComponent,
    // NotificationsComponent,
  ],
  imports: [CommonModule, MenubarModule, MenuModule, PrimeButtonModule],
  exports: [
    // TopMenuComponent,
    // MoreVertComponent,
    // NotificationsComponent,
    UsuarioInfoComponent,
  ],
})
export class NavigationModule {}
