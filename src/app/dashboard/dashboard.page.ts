import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Profile } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { ProfileModalPage } from './profile-modal/profile-modal.page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  boilerTemperature: number;
  currentProfile: Profile;
  profileSubscription: Subscription;
  private temperature: number;

  constructor(public modalController: ModalController, private profileService: ProfileService) {}


  ngOnInit() {
    //this.currentProfile = new Profile('Single Origin 18gram', 85, 9, 10, 30, true);

    this.temperature = 85;
    this.boilerTemperature = this.temperature;

    this.profileSubscription = this.profileService.currentProfile.subscribe(profile => {
      this.currentProfile = profile;
    }, (error => {
      console.error(error);
    }));
  }

  ngOnDestroy(): void {
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
