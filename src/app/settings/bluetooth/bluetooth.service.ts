import { Injectable, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { Subject, Subscription } from 'rxjs';
import { Device } from './bluetooth.device.model';
import { SettingsService } from '../settings.service';
import { Settings } from '../settings.model';
import { DataPayload } from './bluetooth.data-payload.model';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService implements OnDestroy {
  platformReady: boolean;
  device: Subject<Device> = new Subject<Device>();
  isScanning: Subject<boolean> = new Subject<boolean>();
  heartbeat: Subject<string> = new Subject<string>();
  payload: Subject<DataPayload> = new Subject<DataPayload>();

  private settings: Settings;
  private deviceId = '';
  private serviceId = '090c9678-e397-11eb-ba80-0242ac130004';
  private heartbeatCharacteristicId = '145b9574-e397-11eb-ba80-0242ac130004';
  private dataPayloadCharacteristicId = '2e9eb0fa-e397-11eb-ba80-0242ac130004';
  private heartBeatSubscription: Subscription;
  private settingsSubscription: Subscription;
  private dataPayloadSubscription: Subscription;

  constructor(
    private ble: BLE,
    private plt: Platform,
    private settingsService: SettingsService
  ) {
    console.log('Attempting to autoconnect');

    this.settingsSubscription = settingsService.settings.subscribe(
      (settings) => {
        this.settings = settings;
        this.deviceId = this.settings.smartDeviceId;
      }
    );

    // this.plt.ready().then((readySource) => {
    //   this.ble.isEnabled().then(
    //     () => {
    //       console.log('Bluetooth enabled');
    //     },
    //     (rejected) => {
    //       console.log(`Bluetooth reject for reason ${rejected}`);
    //     }
    //   );
    // attempt to auto connect three times

    for (let i = 1; i < 4; i++) {
      console.log(`ATTEMPT ${i}`);
      this.ble.autoConnect(
        this.deviceId,
        this.handleConnection(this),
        this.handleDisconnection
      );
      if (this.ble.isConnected) {
        break;
      }
    }
    // if (!this.ble.isConnected(this.deviceId)) {
    //   this.ble.autoConnect(
    //     this.deviceId,
    //     (device) => {
    //       console.log('Connected to device');
    //       const name = device['name'];
    //       const id = device['id'];
    //       this.device.next(new Device(name, id));
    //       this.setupHeartbeatNotifications();
    //       this.setupDataPayloadNotifications();
    //     },
    //     this.handleDisconnection
    //   );
    // } else {
    //   this.device.next(new Device('Smart Coffee Device', this.deviceId));
    //   console.log('Already connected');
    //   this.setupHeartbeatNotifications();
    // }
    // });
  }

  startDataServices() {
    this.setupHeartbeatNotifications();
    this.setupDataPayloadNotifications();
  }

  async scanDevices() {
    try {
      this.isScanning.next(true);
      this.ble.scan([], 5).subscribe(
        (device) => {
          const name = device['name'];
          const id = device['id'];
          if (name === 'Smart Coffee') {
            this.device.next(new Device(name, id));
            this.ble.stopScan();
            this.connectToDevice(id);
            this.isScanning.next(false);
            this.settingsService.setDeviceId(id);
            this.deviceId = id;
            this.setupHeartbeatNotifications();
            this.setupDataPayloadNotifications();
          }
        },
        (error) => {},
        () => {
          this.isScanning.next(false);
        }
      );
      setTimeout(() => this.isScanning.next(false), 4000);
    } catch (error) {}
  }

  stopScan() {
    this.ble.stopScan();
  }

  private setupHeartbeatNotifications() {
    this.heartBeatSubscription = this.ble
      .startNotification(
        this.deviceId,
        this.serviceId,
        this.heartbeatCharacteristicId
      )
      .subscribe(
        (buffer) => {
          var data = new Uint8Array(buffer);
          var output = new TextDecoder().decode(data);
          console.log(`Converted buffer to ${output}`);
          this.heartbeat.next(output);
        },
        (error) => {
          console.log('HEARTBEAT ERROR');
          console.log(error);
          if (this.heartBeatSubscription) {
            this.heartBeatSubscription.unsubscribe();
          }
        }
      );
  }

  private setupDataPayloadNotifications() {
    this.dataPayloadSubscription = this.ble
      .startNotification(
        this.deviceId,
        this.serviceId,
        this.dataPayloadCharacteristicId
      )
      .subscribe(
        (buffer) => {
          console.log(buffer);
          var data = new Uint8Array(buffer);

          const cycleTime = data[0];
          const boilerTemp = data[1];
          const pumpPressure = data[2];
          const cycleStage = data[3];

          const payload = new DataPayload(
            cycleTime,
            boilerTemp,
            pumpPressure,
            cycleStage
          );
          this.payload.next(payload);
        },
        (error) => {
          this.dataPayloadSubscription.unsubscribe();
          console.log('DATA PAYLOAD ERROR');
          console.log(error);
          return false;
        }
      );
  }

  private connectToDevice(id: string) {
    this.ble.connect(id).subscribe((data) => {
      console.log(`Connected device ${id}`);
      console.log(data);
    });
  }

  private handleConnection(device: any) {
    const name = device['name'];
    const id = device['id'];
    this.device.next(new Device(name, id));
    console.log(`CONNECTION SUCCESFUL FOR DEVICE NAME: ${device} `);
  }

  private handleDisconnection() {
    this.ble.stopNotification(
      this.deviceId,
      this.serviceId,
      this.heartbeatCharacteristicId
    );
    if (this.heartBeatSubscription) {
      this.heartBeatSubscription.unsubscribe();
    }
    this.device.next(undefined);
    console.log('Disonnected');
  }

  ngOnDestroy(): void {
    if (this.heartBeatSubscription) {
      this.heartBeatSubscription.unsubscribe();
    }
  }
}
