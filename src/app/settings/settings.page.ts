import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Device } from './bluetooth/bluetooth.device.model';
import { BluetoothService } from './bluetooth/bluetooth.service';
import { BluetoothModalPage } from './modals/bluetooth-modal/bluetooth-modal.page';
import { PowerModalPage } from './power/power-modal/power-modal.page';
import { Settings } from './settings.model';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  firmwareVersion: number = 1.0;
  appVersion: number = 1.5;
  // device: Device = undefined;
  deviceSubscription: Subscription;
  settingsSubscription: Subscription;
  settings: Settings;


  constructor(public modalController: ModalController, private bluetoothService: BluetoothService, private settingsService: SettingsService) {
    // this.deviceSubscription = bluetoothService.device.subscribe(device => {
    //   this.device = device;
    // });
    this.settingsSubscription = settingsService.settings.subscribe(settings => {
      this.settings = settings;
      this.appVersion = this.settings.appVersion;
    })
  }

  ngOnInit() {
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

}
