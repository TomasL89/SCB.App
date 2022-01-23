import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  },
  {
    path: 'profile-modal',
    loadChildren: () => import('./profile-modal/profile-modal.module').then( m => m.ProfileModalPageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./profile-modal/edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'chart-modal',
    loadChildren: () => import('./chart-modal/chart-modal/chart-modal.module').then( m => m.ChartModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
