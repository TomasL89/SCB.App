import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Device } from './bluetooth/bluetooth.device.model';
import { BluetoothService } from './bluetooth/bluetooth.service';
import { BluetoothModalPage } from './modals/bluetooth-modal/bluetooth-modal.page';
import { FirmwareUpdateModalPage } from './modals/firmware-update-modal/firmware-update-modal.page';
import { WifiModalPage } from './modals/wifi-modal/wifi-modal.page';
import { PowerModalPage } from './power/power-modal/power-modal.page';
import { Settings } from './settings.model';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  firmwareVersion: string = "0.0";
  appVersion: number = 0.1;
  // device: Device = undefined;
  deviceSubscription: Subscription;
  settingsSubscription: Subscription;
  settings: Settings;
  economyModeOn: boolean = true;
  boardSettingsSubscription: Subscription;
  wifiConnected: boolean = false;
  firmwareUpdateAvailable: boolean = false;

  constructor(
    public modalController: ModalController, 
    private bluetoothService: BluetoothService, 
    private settingsService: SettingsService,
    private ngZone: NgZone) {
    // this.deviceSubscription = bluetoothService.device.subscribe(device => {
    //   this.device = device;
    // });
    console.log(`${bluetoothService}`);
    this.settingsSubscription = settingsService.settings.subscribe(settings => {
      this.settings = settings;
      this.appVersion = this.settings.appVersion;
    });
    
  }

  ngOnInit() {
    this.boardSettingsSubscription = this.bluetoothService.boardSettings.subscribe(boardSettings => {
        this.firmwareVersion = boardSettings.firmwareVersion;
        this.wifiConnected = boardSettings.wiFiConnected;
      })
  }

  // async openBluetoothModal() {
  //   const modal = await this.modalController.create({
  //     component: BluetoothModalPage
  //   });
  //   return await modal.present();
  // }

  async openPowerModal() {
    const modal = await this.modalController.create({
      component: PowerModalPage
    });
    return await modal.present();
  }

  async openWifiModal() {
    const modal = await this.modalController.create({
      component: WifiModalPage
    });
    return await modal.present();
  }

  async openFirmwareUpdateModal() {
    const modal = await this.modalController.create({
     component: FirmwareUpdateModalPage 
    });
    return await modal.present();
  }
}
