import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Device } from './bluetooth/bluetooth.device.model';
import { BluetoothService } from './bluetooth/bluetooth.service';
import { BluetoothModalPage } from './modals/bluetooth-modal/bluetooth-modal.page';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  firmwareVersion: number = 1.0;
  appVersion: number = 1.5;
  device: Device = undefined;
  deviceSubscription: Subscription

  constructor(public modalController: ModalController, private bluetoothService: BluetoothService) {
    this.deviceSubscription = bluetoothService.device.subscribe(device => {
      this.device = device;
    })
  }

  ngOnInit() {
  }

  async openBluetoothModal() {
    const modal = await this.modalController.create({
      component: BluetoothModalPage
    });
    return await modal.present();
  }

}
