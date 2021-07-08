import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BluetoothService } from '../../bluetooth/bluetooth.service';

@Component({
  selector: 'app-bluetooth-modal',
  templateUrl: './bluetooth-modal.page.html',
  styleUrls: ['./bluetooth-modal.page.scss'],
})
export class BluetoothModalPage implements AfterViewInit, OnInit {
  foundDevice: boolean = false;
  isScanning: boolean = false;
  private scanningSubscription: Subscription;

  constructor(private modalController: ModalController, private bluetoothService: BluetoothService) {

  }
  ngOnInit(): void {
    this.scanningSubscription = this.bluetoothService.isScanning.subscribe(scanning => {
      this.isScanning = scanning;
      console.log(scanning);
      console.log("Subscribed to scanning oberservable");
    }, error => {
      console.log("GOT AN ERROR");
      console.log(error);
    });
    this.bluetoothService.scanDevices();
  }

  ngAfterViewInit(): void {

  }



  dismiss() {
    this.scanningSubscription.unsubscribe();
    this.modalController.dismiss();
  }

}
