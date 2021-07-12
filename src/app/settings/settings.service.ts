import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs';
import { Settings } from './settings.model';
import { AppVersion } from '@ionic-native/app-version/ngx'

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  settings: Subject<Settings> = new Subject<Settings>();

  constructor(private storage: Storage, private platform: Platform, private appVersion: AppVersion) {
    this.init();
  }

  async init() {
    this.platform.ready().then(async () => {
      await this.storage.create();
      const settings = await this.storage.get("settings") as Settings;
      this.appVersion.getVersionNumber().then(versionNumber => {
        this.setAppVersion(+versionNumber);
      }, error => {
        console.log(error);
      })
      let scheduledPower = new Date(new Date().setHours(9, 0,0));

      if (settings === null) {
        console.log("creating new settings");
        const newSettings = new Settings(
          "00000000-0000-0000-0000-000000000000",
          0.0,
          0.0,
          0,
          ""
        )
        console.log(newSettings);
        await this.storage.set("settings", newSettings);
      } else {

        console.log(settings);
        this.settings.next(settings);
      }
    })

  }

  async setDeviceId(deviceId: string) {
    const settings = await this.storage.get("settings") as Settings;

    if (settings) {
      settings.smartDeviceId = deviceId;
      await this.storage.set("settings", settings);
    }
  }

  async setAppVersion(appVersion: number) {
    const settings = await this.storage.get("settings") as Settings;
    console.log("updating app version");

    if (settings) {
      settings.appVersion = appVersion;
      await this.storage.set("settings", settings);
    }
  }

  async setPower(powerOnSchedule: string, powerTimeout: string) {
    const settings = await this.storage.get("settings") as Settings;
    console.log("updating power settings");

    if (settings) {
      settings.powerSchedule = powerOnSchedule;
      settings.powerTimeout = +powerTimeout.split(":")[1];
      await this.storage.set("settings", settings);
    }
  }
}
