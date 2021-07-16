import { Injectable, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { Subject, Subscription } from 'rxjs';
import { Device } from './bluetooth.device.model';
import { SettingsService } from '../settings.service';
import { Settings } from '../settings.model';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService implements OnDestroy {
  platformReady: boolean;
  device: Subject<Device> = new Subject<Device>();
  isScanning: Subject<boolean> = new Subject<boolean>();
  heartbeat: Subject<string> = new Subject<string>();

  private settings: Settings;
  private deviceId = '';
  private serviceId = '090c9678-e397-11eb-ba80-0242ac130004';
  private heartbeatCharacteristicId = '145b9574-e397-11eb-ba80-0242ac130004';
  private heartBeatSubscription: Subscription;
  private settingsSubscription: Subscription;

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

    this.plt.ready().then((readySource) => {
      this.ble.isEnabled().then(
        () => {
          console.log('Bluetooth enabled');
        },
        (rejected) => {
          console.log(`Bluetooth reject for reason ${rejected}`);
        }
      );
      if (!this.ble.isConnected(this.deviceId)) {
        this.ble.autoConnect(
          this.deviceId,
          (device) => {
            console.log('Connected to device');
            const name = device['name'];
            const id = device['id'];
            this.device.next(new Device(name, id));
            this.setupHeartbeatNotifications();
          },
          this.handleDisconnection
        );
      } else {
        this.device.next(new Device('Smart Coffee Device', this.deviceId));
        console.log('Already connected');
        this.setupHeartbeatNotifications();
      }
    });
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

  startHeartbeat() {
    this.setupHeartbeatNotifications();
  }

  private setupHeartbeatNotifications() {
    this.ble
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
          console.log(error);
          if (this.heartBeatSubscription) {
            this.heartBeatSubscription.unsubscribe();
          }
        }
      );
  }

  private connectToDevice(id: string) {
    this.ble.connect(id).subscribe((data) => {
      console.log(`Connected device ${id}`);
      console.log(data);
    });
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
