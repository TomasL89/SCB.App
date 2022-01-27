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

  private pumpPowerSetting = 0;

  constructor(
    private modalController: ModalController,
    private bleService: BluetoothService) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  updatePressureGuageReading() {
    this.pressureGaugeReading = +this.pressureSetting;
    this.bleService.sendPressurePoint(this.pressureSetting.toString());
  }

  increasePressure() {
    this.pumpPowerSetting += 5;
    this.sendPumpPower();
  }

  decreasePressure() {
    this.pumpPowerSetting -= 5;
    this.sendPumpPower();
  }
  
  storePowerSettingOnDevice() {
    this.bleService.storePowerSettingOnDevice(this.pumpPowerSetting.toString());
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
    console.log(`Sending ${this.pumpPowerSetting.toString()}`);
    this.bleService.sendPumpPowerToDevice(this.pumpPowerSetting.toString());
  }

}
