import { PrimeInputTextareaModule } from './../shared/ui/prime-ng/input-textarea/input-textarea.module';
import { PrimeTableModule } from './../shared/ui/prime-ng/table/table.module';
import { PrimeSplitButtonModule } from './../shared/ui/prime-ng/split-button/split-button.module';
import { PrimePanelModule } from './../shared/ui/prime-ng/panel/panel.module';
import { ExcelService } from '../shared/helpers/excel.service';
import { SocketService } from './../shared/services/socket.service';
import { ConciliaExternaContaService } from './shared/service/concilia-externa.service';
import { ChatService } from './shared/components/chat/chat.service';
import { environment } from './../../environments/environment';
import { PrimeMenuModule } from './../shared/ui/prime-ng/menu/menu.module';
import { PrimeButtonModule } from './../shared/ui/prime-ng/button/button.module';
import { PrimeInputTextModule } from './../shared/ui/prime-ng/input-text/input-text.module';
import { PrimeTabViewModule } from './../shared/ui/prime-ng/tab-view/tab-view.module';
import { PrimeFieldsetModule } from './../shared/ui/prime-ng/fieldset/fieldset.module';
import { PrimeCalendarModule } from './../shared/ui/prime-ng/calendar/calendar.module';
import { PrimeDropdownModule } from './../shared/ui/prime-ng/dropdown/dropdown.module';
import { PrimeProgressSpinnerModule } from './../shared/ui/prime-ng/progress-spinner/progress-spinner.module';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ConciliaExternaContaRoutingModule } from './concilia-externa-conta-routing.module';
import { ConciliaExternaContaComponent } from './concilia-externa-conta.component';
import { ChatComponent } from './shared/components/chat/chat.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { PrimeCardModule } from '../shared/ui/prime-ng/card/card.module';
import { PrimeCheckboxModule } from '../shared/ui/prime-ng/checkbox/checkbox.module';

const config: SocketIoConfig = {
  url: environment.apiServer,
  options: {},
};

@NgModule({
  declarations: [ConciliaExternaContaComponent, ChatComponent],
  imports: [
    CommonModule,
    ConciliaExternaContaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    SharedModule,
    PrimeTableModule,
    PrimeProgressSpinnerModule,
    PrimeDropdownModule,
    PrimeCalendarModule,
    PrimeCardModule,
    PrimeCheckboxModule,
    PrimeFieldsetModule,
    PrimeTabViewModule,
    PrimeInputTextModule,
    PrimeSplitButtonModule,
    PrimeButtonModule,
    PrimeMenuModule,
    PrimePanelModule,
    PrimeInputTextareaModule,
  ],
  providers: [
    ChatService,
    ConciliaExternaContaService,
    DatePipe,
    SocketService,
    ExcelService,
  ],
})
export class ConciliaExternaContaModule {}
