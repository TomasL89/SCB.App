import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'bluetooth-modal',
    loadChildren: () => import('./modals/bluetooth-modal/bluetooth-modal.module').then( m => m.BluetoothModalPageModule)
  },
  {
    path: 'power-modal',
    loadChildren: () => import('./power/power-modal/power-modal.module').then( m => m.PowerModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
