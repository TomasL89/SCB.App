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
  payload: DataPayload;

  private scanningSubscription: Subscription;
  private payloadSubscription: Subscription;
  private deviceSubscription: Subscription;

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
        this.isScanning = false;
        this.foundDevice = true;
        this.device = device;
      }, error => {
        console.log(`ERROR IN BLUETOOTH MODAL ${error}`);
      }
    );
    // this.heartbeatSubscription = this.bluetoothService.heartbeat.subscribe(
    //   (heartbeat) => {
    //     this.zone.run(
    //       () => {
    //         this.heartbeat = heartbeat;
    //       },
    //       (error) => {
    //         console.log(`Got an error: ${error}`);
    //       }
    //     );
    //   }, error => {
    //     console.log(`ERROR WITH BLUETOOTH HEARTBEAT SUB ${error}`);
    //   }
    // );
    this.payloadSubscription = this.bluetoothService.payload.subscribe(payload => {
      this.zone.run(() => {
        this.payload = payload;
      });
    }, error => {
      console.log(`ERROR WITH BLUETOOTH PAYLOAD SUB ${error}`);
    });

    this.bluetoothService.scanDevices();
  }

  connect() {
    this.bluetoothService.connect();
  }

  startData() {
    this.bluetoothService.startDataServices();
  }

  stopData() {
    this.bluetoothService.stopDataServices();
  }

  ngAfterViewInit(): void {}

  doRefresh() {
    this.bluetoothService.stopScan();
    this.bluetoothService.scanDevices();
  }

  dismiss() {
    this.bluetoothService.stopScan();
    this.scanningSubscription.unsubscribe();
    // this.heartbeatSubscription.unsubscribe();
    this.payloadSubscription.unsubscribe();
    this.modalController.dismiss();
  }
}
