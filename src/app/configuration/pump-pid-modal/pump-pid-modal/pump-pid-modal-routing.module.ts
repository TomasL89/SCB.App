import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PumpPidModalPage } from './pump-pid-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PumpPidModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PumpPidModalPageRoutingModule {}
