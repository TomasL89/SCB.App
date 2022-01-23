export class Settings{
  smartDeviceId: string;
  firmwareVersion: number;
  appVersion: number;
  powerTimeout: string;
  ecoModeOn: boolean;

  constructor(
    smartDeviceId: string,
    firmwareVersion: number,
    appVersion: number,
    powerTimeout: string,
    powerSchedule: boolean
    ) {
    this.smartDeviceId = smartDeviceId;
    this.firmwareVersion = firmwareVersion;
    this.appVersion = appVersion;
    this.powerTimeout = powerTimeout;
    this.ecoModeOn = powerSchedule;
  }
}
