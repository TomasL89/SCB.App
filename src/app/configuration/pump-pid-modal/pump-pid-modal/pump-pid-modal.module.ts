import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PumpPidModalPageRoutingModule } from './pump-pid-modal-routing.module';

import { PumpPidModalPage } from './pump-pid-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PumpPidModalPageRoutingModule
  ],
  declarations: [PumpPidModalPage]
})
export class PumpPidModalPageModule {}
