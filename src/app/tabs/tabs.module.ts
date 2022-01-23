import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    ChartsModule
  ],
  declarations: [TabsPage],
  providers: [ScreenOrientation]
})
export class TabsPageModule {}
