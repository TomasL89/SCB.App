import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigurationPage } from './configuration.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationPage
  },
  {
    path: 'boiler-pid-modal',
    loadChildren: () => import('./boiler-pid-modal/boiler-pid-modal/boiler-pid-modal.module').then( m => m.BoilerPidModalPageModule)
  },
  {
    path: 'pump-pid-modal',
    loadChildren: () => import('./pump-pid-modal/pump-pid-modal/pump-pid-modal.module').then( m => m.PumpPidModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationPageRoutingModule {}
