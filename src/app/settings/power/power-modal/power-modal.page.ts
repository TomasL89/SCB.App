import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-power-modal',
  templateUrl: './power-modal.page.html',
  styleUrls: ['./power-modal.page.scss'],
})
export class PowerModalPage implements OnInit {
  powerOnSchedule = "1990-02-19T06:00"
  powerTimeout = "1990-02-19T06:00";
  constructor(private modalController: ModalController, private settingsService: SettingsService) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  savePowerSettings() {
    const scheduledHours = this.powerOnSchedule.split(":")[0];
    const scheduledMinutes = this.powerOnSchedule.split(":")[1];
    console.log(`${this.powerTimeout.split(":")[1]} minutes`);
    this.settingsService.setPower(this.powerOnSchedule, this.powerTimeout);
  }

}
