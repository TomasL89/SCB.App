import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BluetoothModalPageRoutingModule } from './bluetooth-modal-routing.module';

import { BluetoothModalPage } from './bluetooth-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BluetoothModalPageRoutingModule
  ],
  declarations: [BluetoothModalPage]
})
export class BluetoothModalPageModule {}
