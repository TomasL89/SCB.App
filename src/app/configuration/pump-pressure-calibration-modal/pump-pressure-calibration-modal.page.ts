import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BluetoothService } from 'src/app/settings/bluetooth/bluetooth.service';

@Component({
  selector: 'app-pump-pressure-calibration-modal',
  templateUrl: './pump-pressure-calibration-modal.page.html',
  styleUrls: ['./pump-pressure-calibration-modal.page.scss'],
})
export class PumpPressureCalibrationModalPage implements OnInit {
  
  isCalibrating = false;
  pressureGaugeReading = 0.0;
  pressureSetting = 1;
  pumpPowerSetting = 0;

  private buffer = new Array<number>();

  constructor(
    private modalController: ModalController,
    private bleService: BluetoothService) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  // updatePressureGuageReading() {
  //   this.pressureSetting = +this.pressureSetting;
  //   this.bleService.sendPressurePoint(this.pressureSetting.toString());
  // }

  increasePressure() {
    if (this.pumpPowerSetting >= 100) {
      return;
    }
    this.pumpPowerSetting += 2;
    this.sendPumpPower();
  }

  decreasePressure() {
    if (this.pumpPowerSetting <= 0) {
      return;
    }
    this.pumpPowerSetting -= 2;
    this.sendPumpPower();
  }

  nextPressurePoint() {
    if (this.pressureSetting < 12) {
      this.pressureSetting += 1;
    }
  
    if (this.buffer[this.pressureSetting] > 0 ){
      this.pumpPowerSetting = this.buffer[this.pressureSetting];
      this.sendPumpPower();
    }
    else {
      this.increasePressure();
    }

    //this.bleService.sendPressurePoint(this.pressureSetting.toString());

    //this.storePowerSettingOnDevice();
  }

  previousPressurePoint() {

    if (this.pressureSetting == 0) {
      return;
    }
    //this.bleService.sendPressurePoint(this.pressureSetting.toString());

    this.pressureSetting -= 1;
    this.pumpPowerSetting = this.buffer[this.pressureSetting];
    //this.storePowerSettingOnDevice();
  }

  toggleCalibrationMode() {
    this.isCalibrating = !this.isCalibrating;
    if (this.isCalibrating)
    {
      this.bleService.startPumpCalibrationMode();
    }
    else {
      this.bleService.stopPumpCalibrationMode();
    }
  }

  finishCalibrationAndStore() {
    this.isCalibrating = false;
    this.bleService.finishCalibrationAndStore();
    this.bleService.stopPumpCalibrationMode();
  }

  private sendPumpPower() {
    this.buffer[this.pressureSetting] = this.pumpPowerSetting;
    console.log(`Sending ${this.pumpPowerSetting.toString()}`);
    this.bleService.sendPumpPowerToDevice(this.pressureSetting, this.pumpPowerSetting);
  }

  // private storePowerSettingOnDevice() {
  //   this.bleService.storePowerSettingOnDevice(this.pumpPowerSetting.toString());
  // }

}
