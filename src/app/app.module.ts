import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProfileService } from './profile/profile.service';
import { BluetoothService } from './settings/bluetooth/bluetooth.service';
import { SettingsService } from './settings/settings.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { BLE } from '@ionic-native/ble/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { ChartsModule } from 'ng2-charts';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SliderModule } from 'primeng/slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    ChartsModule,
    SliderModule,
    NgxSliderModule
    ],
  providers: [
    {
      provide: RouteReuseStrategy, useClass: IonicRouteStrategy
    },
    ProfileService,
    BluetoothService,
    SettingsService,
    BLE,
    AppVersion,
    ScreenOrientation
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
