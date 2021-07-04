import { Injectable } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  constructor(public bluetoothle: BluetoothLE, public plt: Platform) {
    this.plt.ready().then((readySource) => {
      console.log('Platform ready from', readySource);

      this.bluetoothle.initialize().subscribe(ble => {
        console.log('ble', ble.status);
      })
    })
  }
}
