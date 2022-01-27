import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PumpPressureCalibrationModalPage } from './pump-pressure-calibration-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PumpPressureCalibrationModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PumpPressureCalibrationModalPageRoutingModule {}
