import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FirmwareUpdateModalPageRoutingModule } from './firmware-update-modal-routing.module';

import { FirmwareUpdateModalPage } from './firmware-update-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FirmwareUpdateModalPageRoutingModule
  ],
  declarations: [FirmwareUpdateModalPage]
})
export class FirmwareUpdateModalPageModule {}
