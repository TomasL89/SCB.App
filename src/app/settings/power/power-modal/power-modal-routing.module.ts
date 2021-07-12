import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PowerModalPage } from './power-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PowerModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PowerModalPageRoutingModule {}
