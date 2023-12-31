import { Injectable, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { Subject, Subscription } from 'rxjs';
import { Device } from './bluetooth.device.model';
import { SettingsService } from '../settings.service';
import { Settings } from '../settings.model';
import { DataPayload } from './bluetooth.data-payload.model';
import { Profile } from 'src/app/profile/profile.model';
import { BoilerPIDTuningDataPayload } from './boiler-pid.data-payload.model';
import { PumpPIDTuningDataPayload } from './pump-pid.data-payload.model';
import { BoardSettingsDataPayload } from './board-settings.data-payload.model';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService implements OnDestroy {
  platformReady: boolean;
  device: Subject<Device> = new Subject<Device>();
  isScanning: Subject<boolean> = new Subject<boolean>();
  // heartbeat: Subject<string> = new Subject<string>();
  payload: Subject<DataPayload> = new Subject<DataPayload>();
  boilerTuningPayload: Subject<BoilerPIDTuningDataPayload> = new Subject<BoilerPIDTuningDataPayload>();
  pumpTuningPayload: Subject<PumpPIDTuningDataPayload> = new Subject<PumpPIDTuningDataPayload>();
  boardSettings: Subject<BoardSettingsDataPayload> = new Subject<BoardSettingsDataPayload>();
  firmwareUpdatePayload: Subject<number> = new Subject<number>();

  private settings: Settings;
  private deviceId = '';
  private serviceId = '090c9678-e397-11eb-ba80-0242ac130004';
  private boardSettingsCharacteristic = '145b9574-e397-11eb-ba80-0242ac130004';
  private dataPayloadCharacteristicId = '2e9eb0fa-e397-11eb-ba80-0242ac130004';
  private profilePayloadCharacteristicId = 'afe6a8da-e397-11eb-ba80-0242ac130004';
  //private heaterTuningPayloadCharacteristicId = 'fd045b94-e397-11eb-ba80-0242ac130004';
  private pumpTuningPayloadCharacteristicID = '5b74e49a-e397-11eb-ba80-0242ac130004';
  private pumpCalibrationCharacteristicID = '57c1ff4f-c7b1-41ad-a58e-421e77fdbd37';
  private deviceFirmwareUpdateCharacteristicID = '8b75c8d5-e397-11eb-ba80-0242ac130004';

  private heartBeatSubscription: Subscription;
  private settingsSubscription: Subscription;
  private dataPayloadSubscription: Subscription;
  private pidTuningPayloadSubscription: Subscription;
  private boardSettingsSubscription: Subscription;
  private firmwareUpdateSubscription: Subscription;
  private isConnected: boolean;

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
        console.log(`SETTINGS DEVICE ID: ${this.deviceId}`);
      }
    );

    this.plt.ready().then((readySource) => {
        this.ble.enable().then(() => {
          this.ble.isEnabled().then(
            () => {
              console.log('Bluetooth enabled');
              this.ble.autoConnect(
                this.deviceId,
                this.handleConnection,
                this.handleDisconnection
              );
            },
            (rejected) => {
              console.log(`Bluetooth reject for reason ${rejected}`);
            }
          );
        }).catch(error =>
          {
            console.log(`COULD NOT ENABLE ${error}`);
          })
    });
  }

  connect() {
    console.log("ATTEMPTING TO CONNECT");
    this.ble.connect(this.deviceId).subscribe(() => {
      console.log("connected");
      this.stopDataServices();
      this.startDataServices();
    },error => {
      console.log(`ERROR WITH CONNECTION ${error}`);
    })
  }

  startDataServices() {
    // this.setupBoardSettingsNotifcations();
    this.setupHeartbeatNotifications();
    this.setupDataPayloadNotifications();
    //this.setupBoilerPidTuningNotifications();
    //this.setupPumpPidTuningNotifications();
  }


  stopDataServices() {
    this.ble.stopNotification(this.deviceId, this.serviceId ,this.boardSettingsCharacteristic);
    this.ble.stopNotification(this.deviceId, this.serviceId ,this.dataPayloadCharacteristicId);
    // this.ble.startNotification(this.deviceId, this.serviceId, this.boardSettingsCharacteristicID);
    // todo this might need to be started up in a different way
    //this.ble.stopNotification(this.deviceId, this.serviceId, this.heaterTuningPayloadCharacteristicId);
  }

  scanDevices() {
    this.ble.isConnected(this.deviceId).then(() => {
      this.isScanning.next(false);
      this.device.next(new Device("Smart Coffee", this.deviceId));
      console.log("ALREADY CONNECTED AND NO NEED TO SCAN");
      this.stopDataServices();
      this.startDataServices();
    }, rejected => {
      this.scanDevicesAsync();
    });
  }

  stopScan() {
    this.ble.stopScan();
  }

  sendProfileToDevice(profile: Profile) {
    const boilerTemp = +profile.boilerTemperature;
    const pumpPressure = +profile.pumpPressure;
    const preinfusionTime = +profile.preInfusionTime;
    const shotTime = +profile.shotTime;
    const preinfusionPressure = +profile.preinfusionPressure;

    // need better validation and to alert the user
    if (boilerTemp <= 0 || boilerTemp === undefined) return;
    if (pumpPressure <= 0 || pumpPressure === undefined) return;
    if (preinfusionTime < -1 || preinfusionTime === undefined) return;
    if (shotTime <= 0 || shotTime === undefined) return;

    const profilePayload = [];
    profilePayload.push(boilerTemp);

    // add preinfusion pressure points for each second
    for (var i = 0; i < preinfusionTime; i++) {
      profilePayload.push(preinfusionPressure);
    }

    for (var i = 0; i < shotTime; i++) {
      profilePayload.push(pumpPressure);
    }

    // temperature + preinfusion (ie 10 seconds) + shot time (ie 20 seconds) = 31
    const currentPoint = 1 + preinfusionTime + shotTime;
    const remainingPoints = 60 - currentPoint;

    for (var i = 0; i <= remainingPoints; i++) {
      profilePayload.push(0);
    }

    const blePayload = new TextEncoder().encode(profilePayload.toString());

    this.ble.writeWithoutResponse(this.deviceId, this.serviceId, this.profilePayloadCharacteristicId, blePayload.buffer).then(completed => {
      console.log(`completed with response ${completed}`);
    }).catch(rejected => {
      console.log(`failed with response ${rejected}`);
    });

    //  private profilePrefixes = ['b:', 'p:', 'i:', 's:'];

    // const profileSettings = [
    //   "b:" + boilerTemp,
    //   pumpPressure < 10 ? "p:0" + pumpPressure : "p:" + pumpPressure,
    //   preinfusionTime < 10 ? "i:0" + preinfusionTime : "i:" + preinfusionTime,
    //   shotTime < 10 ? "s:0" + shotTime : "s:" + shotTime];

    // for (var i = 0; i < profileSettings.length; i++) {

    //   let payload = new TextEncoder().encode(profileSettings[i]);

    //   this.ble.writeWithoutResponse(this.deviceId, this.serviceId ,this.profilePayloadCharacteristicId, payload.buffer).then(completed => {
    //     console.log(`completed with response ${completed}`);
    //   }).catch(rejected => {
    //     console.log(`failed with response ${rejected}`);
    //   });
    // }


  }

  startPumpCalibrationMode() {
    this.togglePumpCalibrationMode('1')
  }

  stopPumpCalibrationMode() {
    this.togglePumpCalibrationMode('0');
  }

  sendPumpPowerToDevice(pressureSetting: number, power: number) {
    const transformedPressure = pressureSetting > 9 ? pressureSetting.toString() : "0" + pressureSetting.toString();
    const transformedPower = power < 10 ? "00" + power.toString() : power < 99 ? "0" + power.toString() : power.toString();
    console.log(`Sending power to device p:${transformedPressure}:${transformedPower}`);
    const payload = new TextEncoder().encode("p:"+transformedPressure+":"+transformedPower);

    this.ble.writeWithoutResponse(this.deviceId, this.serviceId ,this.pumpCalibrationCharacteristicID, payload.buffer).then(completed => {
      //console.log(`completed with response ${completed}`);
    }).catch(rejected => {
      //console.log(`failed with response ${rejected}`);
    });
  }

  storePowerSettingOnDevice(powerSetting: string) {
    const dataToSend = "c:"+powerSetting;

    const payload = new TextEncoder().encode(dataToSend);
    this.ble.writeWithoutResponse(this.deviceId, this.serviceId ,this.pumpCalibrationCharacteristicID, payload.buffer).then(completed => {
      console.log(`completed with response ${completed}`);
    }).catch(rejected => {
      console.log(`failed with response ${rejected}`);
    });
  }

  sendPressurePoint(pressurePoint: string) {
    const dataToSend = "p:"+pressurePoint;

    const payload = new TextEncoder().encode(dataToSend);
    this.ble.writeWithoutResponse(this.deviceId, this.serviceId ,this.pumpCalibrationCharacteristicID, payload.buffer).then(completed => {
      console.log(`completed with response ${completed}`);
    }).catch(rejected => {
      console.log(`failed with response ${rejected}`);
    }); 
  }

  finishCalibrationAndStore() {
    const payload = new TextEncoder().encode("f");
    this.ble.writeWithoutResponse(this.deviceId, this.serviceId ,this.pumpCalibrationCharacteristicID, payload.buffer).then(completed => {
      console.log(`completed with response ${completed}`);
    }).catch(rejected => {
      console.log(`failed with response ${rejected}`);
    }); 
  }

  startFirmwareUpdate() {
    const dataToSend = "1";

    const payload = new TextEncoder().encode(dataToSend);
    this.ble.writeWithoutResponse(this.deviceId, this.serviceId, this.deviceFirmwareUpdateCharacteristicID, payload.buffer).then(completed => {
      console.log('Send start firmware update command');
      this.setupFirmwareUpdatePayloadNotifications
      
    }).catch(rejected => {
      console.log(`failed with response ${rejected}`);
    })
  }

  private togglePumpCalibrationMode(enabled: string) {
    const payload = new TextEncoder().encode(enabled);
    this.ble.writeWithoutResponse(this.deviceId, this.serviceId ,this.pumpCalibrationCharacteristicID, payload.buffer).then(completed => {
      console.log(`completed with response ${completed}`);
    }).catch(rejected => {
      console.log(`failed with response ${rejected}`);
    });


  }

  private async scanDevicesAsync() {
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
          }
        },
        (error) => {
          console.log(`SCANNING ERROR ${error}`);
        },
        () => {
          this.isScanning.next(false);
       
        }
      );
      setTimeout(() => this.isScanning.next(false), 4000);
    } catch (error) {}
  }

  private setupHeartbeatNotifications() {
    this.heartBeatSubscription = this.ble
      .startNotification(
        this.deviceId,
        this.serviceId,
        this.boardSettingsCharacteristic
      )
      .subscribe(
        (buffer) => {
          var data = new Uint8Array(buffer[0]);
          const boardSettingsPayload = new BoardSettingsDataPayload(`${data[0]}.${data[1]}`, data[2]); 
          this.boardSettings.next(boardSettingsPayload);
        },
        (error) => {
          console.log('HEARTBEAT ERROR');
          console.log(error);
          if (this.heartBeatSubscription) {
            this.heartBeatSubscription.unsubscribe();
          }
        },
      );
  }

  // private setupBoardSettingsNotifcations() {
  //   console.log("Starting setupBoardSettingsNotifcations setup");
  //   this.boardSettingsSubscription = this.ble
  //   .startNotification(
  //     this.deviceId,
  //     this.serviceId,
  //     this.boardSettingsCharacteristicID
  //   )
  //   .subscribe(
  //     (buffer) => {
  //       console.log('got board setting payload');
     
  //     },
  //     (error) => {
  //       this.dataPayloadSubscription.unsubscribe();
  //         console.log('BOARD DATA PAYLOAD ERROR');
  //         console.log(error);
  //         return false;
  //     },
  //   );
  //   console.log("Finished setupBoardSettingsNotifcations setup");
  // }

  private setupDataPayloadNotifications() {
    this.dataPayloadSubscription = this.ble
      .startNotification(
        this.deviceId,
        this.serviceId,
        this.dataPayloadCharacteristicId
      )
      .subscribe(
        (buffer) => {
          var data = new Uint8Array(buffer[0]);
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

  private setupFirmwareUpdatePayloadNotifications() {
    this.firmwareUpdateSubscription = this.ble
      .startNotification(
        this.deviceId,
        this.serviceId,
        this.deviceFirmwareUpdateCharacteristicID
      )
      .subscribe(
        (buffer) => {
          var data = new Uint8Array(buffer[0]);
          const progress = data[0];

          
          this.firmwareUpdatePayload.next(progress);
          console.log(`Progress: ${progress} %`);
        },
        (error) => {
          this.firmwareUpdateSubscription.unsubscribe();
          console.log('DATA PAYLOAD ERROR');
          console.log(error);
          return false;
        }
      );
  }

  //  private setupBoilerPidTuningNotifications() {
  //   this.ble
  //     .startNotification(
  //       this.deviceId,
  //       this.serviceId,
  //       this.heaterTuningPayloadCharacteristicId
  //     )
  //     .subscribe(
  //       (buffer) => {
  //         var data = new Uint8Array(buffer[0]);
  //         const cycleTIme = data[0];
  //         const boilerTemp = data[1];
  //         const boilerTarget = data[2];
  //         const dimmerPower = data[3];
  //         const kp = data[4];
  //         const ki = data[5];
  //         const kd = data[6];

  //         const payload = new BoilerPIDTuningDataPayload(
  //           cycleTIme,
  //           boilerTemp,
  //           boilerTarget,
  //           dimmerPower,
  //           kp,
  //           ki,
  //           kd
  //         );
  //         this.boilerTuningPayload.next(payload);
  //       },
  //       (error) => {
  //         console.log('PID TUNING PAYLOAD ERROR');
  //         console.log(error);
  //       }
  //     );
  // }

  // private setupPumpPidTuningNotifications() {
  //   this.ble
  //     .startNotification(
  //       this.deviceId,
  //       this.serviceId,
  //       this.pumpTuningPayloadCharacteristicID
  //     )
  //     .subscribe(
  //       (buffer) => {
  //         var data = new Uint8Array(buffer[0]);
  //         const cycleTIme = data[0];
  //         const pumpPressure = data[1];
  //         const pumpPressureTarget = data[2];
  //         const dimmerPower = data[3];
  //         const kp = data[4];
  //         const ki = data[5];
  //         const kd = data[6];

  //         const payload = new PumpPIDTuningDataPayload(
  //           cycleTIme,
  //           pumpPressure,
  //           pumpPressureTarget,
  //           dimmerPower,
  //           kp,
  //           ki,
  //           kd
  //         );
  //         this.pumpTuningPayload.next(payload);
  //       },
  //       (error) => {
  //         console.log('PID TUNING PAYLOAD ERROR');
  //         console.log(error);
  //       }
  //     );
  // }

  setupProfilePayloadNotifications() {
    this.ble.startNotification(this.deviceId, this.serviceId, this.profilePayloadCharacteristicId).subscribe(buffer => {
      console.log('payload notifiction');
    })
  }

  private connectToDevice(id: string) {
    this.ble.connect(id).subscribe((data) => {
      console.log(`Connected device ${id}`);
      this.stopDataServices();
      this.startDataServices();
      console.log(data);
    });
  }

  private handleConnection() {
    this.setupHeartbeatNotifications();
    this.setupDataPayloadNotifications();
    //this.setupBoilerPidTuningNotifications();
    //this.setupPumpPidTuningNotifications();
    this.isConnected = true;
    console.log(`Connected to Smart Coffee device: ${this.deviceId}`);
    this.device.next(new Device('Smart Coffee', this.deviceId));
  }

  private handleDisconnection() {
    this.ble.stopNotification(
      this.deviceId,
      this.serviceId,
      this.boardSettingsCharacteristic
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
