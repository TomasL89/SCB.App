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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationPageRoutingModule {}
