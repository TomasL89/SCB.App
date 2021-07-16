import {
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataPayload } from '../../bluetooth/bluetooth.data-payload.model';
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
  payload: DataPayload;

  private scanningSubscription: Subscription;
  private deviceSubscription: Subscription;
  private heartbeatSubscription: Subscription;
  private payloadSubscription: Subscription;

  constructor(
    private modalController: ModalController,
    private bluetoothService: BluetoothService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    // todo refactor this, it's messy and problematic
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
        console.log(`Conencted to device ${device.name}`);
        // this.bluetoothService.startHeartbeat();
        // this.bluetoothService.startDataPayload();
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
    this.payloadSubscription = this.bluetoothService.payload.subscribe(payload => {
      this.zone.run(() => {
        this.payload = payload;
      });
    });

    this.bluetoothService.scanDevices();
  }

  startData() {
    this.bluetoothService.startDataServices();
    // this.bluetoothService.startHeartbeat();
    // this.bluetoothService.startDataPayload();
  }

  ngAfterViewInit(): void {}

  doRefresh() {
    this.bluetoothService.stopScan();
    this.bluetoothService.scanDevices();
  }

  dismiss() {
    this.bluetoothService.stopScan();
    this.scanningSubscription.unsubscribe();
    this.heartbeatSubscription.unsubscribe();
    this.payloadSubscription.unsubscribe();
    this.modalController.dismiss();
  }
}
