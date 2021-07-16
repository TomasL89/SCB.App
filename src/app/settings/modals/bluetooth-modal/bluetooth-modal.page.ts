import {
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  heartbeat: string;
  heartbeatCount = 0;
  private scanningSubscription: Subscription;
  private deviceSubscription: Subscription;
  private heartbeatSubscription: Subscription;

  constructor(
    private modalController: ModalController,
    private bluetoothService: BluetoothService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.scanningSubscription = this.bluetoothService.isScanning.subscribe(
      (scanning) => {
        this.isScanning = scanning;
      },
      (error) => {
        console.log(error);
      }
    );
    this.deviceSubscription = this.bluetoothService.device.subscribe(
      (device) => {
        this.foundDevice = true;
        this.device = device;
      }
    );
    this.heartbeatSubscription = this.bluetoothService.heartbeat.subscribe(
      (heartbeat) => {
        this.zone.run(
          () => {
            console.log('got heart beat from service');
            this.heartbeatCount++;
            console.log(`Heartbeat Count: ${this.heartbeatCount}`);
            this.heartbeat = heartbeat;
            console.log(`Heartbeat message: ${this.heartbeat}`);
          },
          (error) => {
            console.log(`Got an error: ${error}`);
          }
        );
      }
    );

    this.bluetoothService.scanDevices();
  }

  getHeartbeat() {
    this.bluetoothService.startHeartbeat();
  }

  ngAfterViewInit(): void {}

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
