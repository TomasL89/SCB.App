import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoilerPidModalPageRoutingModule } from './boiler-pid-modal-routing.module';

import { BoilerPidModalPage } from './boiler-pid-modal.page';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoilerPidModalPageRoutingModule,
    ChartsModule,
  ],
  declarations: [BoilerPidModalPage]
})
export class BoilerPidModalPageModule {}
