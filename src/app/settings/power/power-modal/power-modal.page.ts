import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Settings } from '../../settings.model';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-power-modal',
  templateUrl: './power-modal.page.html',
  styleUrls: ['./power-modal.page.scss'],
})
export class PowerModalPage implements OnInit {
  powerTimeout = "1990-02-19T06:00";
  ecoModeOn: boolean;
  constructor(private modalController: ModalController, private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.settingsService.settings.subscribe(x => this.initialiseSettings(x));
  }

  dismiss() {
    this.modalController.dismiss();
  }

  private initialiseSettings(settings: Settings) {
    console.log('Initialising');
    console.log(settings);
    this.powerTimeout = settings.powerTimeout;
    this.ecoModeOn = settings.ecoModeOn;
  }

  savePowerSettings() {
    console.log(`Eco mode: ${this.ecoModeOn}`);
    this.settingsService.setPower(this.ecoModeOn, this.powerTimeout);
  }

}
