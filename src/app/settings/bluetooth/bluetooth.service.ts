import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { Subject } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';
import { Device } from './bluetooth.device.model';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  deviceFound: Subject<boolean> = new Subject<boolean>();
  isScanning: Subject<boolean> = new Subject<boolean>();
  private deviceId = "0EBC0E51-125A-71FA-4641-D3F3F0CB9F5C";

  constructor(public ble: BLE, public plt: Platform) {
    this.plt.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
    })
  }

  async scanDevices() {
    try {
      this.isScanning.next(true);
      this.ble.scan([], 5).subscribe(device => {
        if (device.)
      },error => {
      }, () => {

        this.isScanning.next(false);
        console.log(this.isScanning.observers);
      });
      setTimeout(() => this.isScanning.next(false), 4000)
    } catch (error) {
      this.isScanning.next(false);
    }
  }
}
