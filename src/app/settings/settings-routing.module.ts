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
  },
  {
    path: 'wifi-modal',
    loadChildren: () => import('./modals/wifi-modal/wifi-modal.module').then( m => m.WifiModalPageModule)
  },
  {
    path: 'firmware-update-modal',
    loadChildren: () => import('./modals/firmware-update-modal/firmware-update-modal.module').then( m => m.FirmwareUpdateModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
