import { PrimePanelModule } from './../shared/ui/prime-ng/panel/panel.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConciliaExternaDwhRoutingModule } from './concilia-externa-dwh-routing.module';
import { ConciliaExternaDwhComponent } from './concilia-externa-dwh.component';

@NgModule({
  declarations: [ConciliaExternaDwhComponent],
  imports: [
    CommonModule,
    ConciliaExternaDwhRoutingModule,
    SharedModule,
    PrimePanelModule,
  ],
})
export class ConciliaExternaDwhModule {}
