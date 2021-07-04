import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BluetoothService } from '../../bluetooth/bluetooth.service';

@Component({
  selector: 'app-bluetooth-modal',
  templateUrl: './bluetooth-modal.page.html',
  styleUrls: ['./bluetooth-modal.page.scss'],
})
export class BluetoothModalPage implements OnInit {
  foundDevice: boolean = true;

  constructor(private modalController: ModalController, bluetoothService: BluetoothService) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
