import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WifiModalPageRoutingModule } from './wifi-modal-routing.module';

import { WifiModalPage } from './wifi-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    WifiModalPageRoutingModule
  ],
  declarations: [WifiModalPage]
})
export class WifiModalPageModule {}
