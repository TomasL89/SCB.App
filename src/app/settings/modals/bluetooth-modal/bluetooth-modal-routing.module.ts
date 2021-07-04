import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BluetoothModalPage } from './bluetooth-modal.page';

const routes: Routes = [
  {
    path: '',
    component: BluetoothModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BluetoothModalPageRoutingModule {}
