import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BluetoothModalPage } from './modals/bluetooth-modal/bluetooth-modal.page';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  firmwareVersion: number = 1.0;
  appVersion: number = 1.5;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  async openBluetoothModal() {
    const modal = await this.modalController.create({
      component: BluetoothModalPage
    });
    return await modal.present();
  }

}
