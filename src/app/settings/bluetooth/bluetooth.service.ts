import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { Subject } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';
import { Device } from './bluetooth.device.model';
import { SettingsService } from '../settings.service';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  platformReady: boolean;
  device: Subject<Device> = new Subject<Device>();
  isScanning: Subject<boolean> = new Subject<boolean>();
  private deviceId = "0EBC0E51-125A-71FA-4641-D3F3F0CB9F5C";


  constructor(private ble: BLE, private plt: Platform, private settings: SettingsService) {
      console.log("Attempting to autoconnect");
      this.plt.ready().then((readySource) => {
        this.ble.isEnabled().then(() => {
          console.log("Bluetooth enabled");
        }, rejected => {
          console.log(`Bluetooth reject for reason ${rejected}`);
        })
        if (!this.ble.isConnected(this.deviceId)){
          this.ble.autoConnect(this.deviceId, device => {
            console.log("Connected to device");
            const name = device["name"];
            const id = device["id"];
            this.device.next(new Device(name, id));
          }, this.handleDisconnection)
        } else {
          this.device.next(new Device("Smart Coffee Device", this.deviceId));
          console.log("Already connected")
        }

      })

  }

  async scanDevices() {
    try {
      this.isScanning.next(true);
      this.ble.scan([], 5).subscribe(device => {
        const name = device["name"];
        const id = device["id"];
        if (id === this.deviceId) {
          this.device.next(new Device(name, id));
          this.ble.stopScan();
          this.connectToDevice(id);
          this.isScanning.next(false);
          this.settings.setDeviceId(id);
        }

      },error => {
      }, () => {
        this.isScanning.next(false);
      });
      setTimeout(() => this.isScanning.next(false), 4000)
    } catch (error) {
      }
  }

  stopScan() {
    this.ble.stopScan();
  }

  private connectToDevice(id: string) {
    this.ble.connect(id).subscribe(data => {
      console.log(`Connected device ${id}`);
      console.log(data);
    })
  }

  private handleDisconnection() {
    this.device.next(undefined);
    console.log("Disonnected");
  }
}
