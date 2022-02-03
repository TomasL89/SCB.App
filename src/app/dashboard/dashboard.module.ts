import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { ChartsModule } from 'ng2-charts';
import { SliderModule } from 'primeng/slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    ChartsModule,
    SliderModule,
    NgxSliderModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
