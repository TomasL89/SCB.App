import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PumpPressureCalibrationModalPageRoutingModule } from './pump-pressure-calibration-modal-routing.module';

import { PumpPressureCalibrationModalPage } from './pump-pressure-calibration-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PumpPressureCalibrationModalPageRoutingModule
  ],
  declarations: [PumpPressureCalibrationModalPage]
})
export class PumpPressureCalibrationModalPageModule {}
