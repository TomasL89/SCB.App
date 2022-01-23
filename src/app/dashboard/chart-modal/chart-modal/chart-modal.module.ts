import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChartModalPageRoutingModule } from './chart-modal-routing.module';

import { ChartModalPage } from './chart-modal.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ChartsModule } from 'ng2-charts';
import { ChartComponent } from '../../chart/chart/chart.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartModalPageRoutingModule,
    ChartsModule
  ],
  declarations: [ChartModalPage, ChartComponent],
  providers: [ScreenOrientation]
})
export class ChartModalPageModule {}
