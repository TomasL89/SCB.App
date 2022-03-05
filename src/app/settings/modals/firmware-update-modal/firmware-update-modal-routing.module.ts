import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FirmwareUpdateModalPage } from './firmware-update-modal.page';

const routes: Routes = [
  {
    path: '',
    component: FirmwareUpdateModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FirmwareUpdateModalPageRoutingModule {}
