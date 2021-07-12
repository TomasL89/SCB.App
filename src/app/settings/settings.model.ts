export class Settings{
  smartDeviceId: string;
  firmwareVersion: number;
  appVersion: number;
  powerTimeout: number;
  powerSchedule: string;

  constructor(
    smartDeviceId: string,
    firmwareVersion: number,
    appVersion: number,
    powerTimeout: number,
    powerSchedule: string
    ) {
    this.smartDeviceId = smartDeviceId;
    this.firmwareVersion = firmwareVersion;
    this.appVersion = appVersion;
    this.powerTimeout = powerTimeout;
    this.powerSchedule = powerSchedule;
  }
}
