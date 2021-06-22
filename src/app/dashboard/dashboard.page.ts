import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Profile } from '../common/profiles/profile.model';
import { ProfileModalPage } from './profile-modal/profile-modal.page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  boilerTemperature: number;
  currentProfile: Profile;

  private temperature: number;

  constructor(public modalController: ModalController) {}

  ngOnInit() {
    this.currentProfile = new Profile('Single Origin 18gram', 85, 9, 10, 30);

    this.temperature = 85;
    this.boilerTemperature = this.temperature;
  }

  openChartModal() {
    console.log("open chart modal");
  }

  async openProfileModal() {
    const modal = await this.modalController.create({
      component: ProfileModalPage
    });
    return await modal.present();
  }
}
