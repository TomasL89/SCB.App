import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PowerModalPageRoutingModule } from './power-modal-routing.module';

import { PowerModalPage } from './power-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PowerModalPageRoutingModule
  ],
  declarations: [PowerModalPage]
})
export class PowerModalPageModule {}
