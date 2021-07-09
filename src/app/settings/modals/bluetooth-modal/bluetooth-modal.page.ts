import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Device } from '../../bluetooth/bluetooth.device.model';
import { BluetoothService } from '../../bluetooth/bluetooth.service';

@Component({
  selector: 'app-bluetooth-modal',
  templateUrl: './bluetooth-modal.page.html',
  styleUrls: ['./bluetooth-modal.page.scss'],
})
export class BluetoothModalPage implements AfterViewInit, OnInit {
  device: Device;
  foundDevice: boolean = false;
  isScanning: boolean = false;
  private scanningSubscription: Subscription;
  private deviceSubscription: Subscription;
  constructor(private modalController: ModalController, private bluetoothService: BluetoothService) {

  }
  ngOnInit(): void {
    this.scanningSubscription = this.bluetoothService.isScanning.subscribe(scanning => {
      this.isScanning = scanning;
    }, error => {
      console.log(error);
    });
    this.deviceSubscription = this.bluetoothService.device.subscribe(device => {
      this.foundDevice = true;
      this.device = device;
    })

    this.bluetoothService.scanDevices();
  }

  ngAfterViewInit(): void {

  }

  doRefresh() {
    this.bluetoothService.stopScan();
    this.bluetoothService.scanDevices();
  }

  dismiss() {
    this.bluetoothService.stopScan();
    this.scanningSubscription.unsubscribe();
    this.modalController.dismiss();
  }

}
