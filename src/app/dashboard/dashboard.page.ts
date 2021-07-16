import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Profile } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { BluetoothService } from '../settings/bluetooth/bluetooth.service';
import { ProfileModalPage } from './profile-modal/profile-modal.page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  boilerTemperature: number = 100;
  currentProfile: Profile;

  private profileSubscription: Subscription;
  private dataPayloadSubscription: Subscription;

  constructor(
    public modalController: ModalController,
    private profileService: ProfileService,
    private bluetoothService: BluetoothService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    //this.currentProfile = new Profile('Single Origin 18gram', 85, 9, 10, 30, true);
    this.dataPayloadSubscription = this.bluetoothService.payload.subscribe(payload => {
      this.ngZone.run(() => {
        this.boilerTemperature = payload.boilerTemp;
      });
    });

    this.profileSubscription = this.profileService.currentProfile.subscribe(
      (profile) => {
        this.currentProfile = profile;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.dataPayloadSubscription) {
      this.dataPayloadSubscription.unsubscribe();
    }
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  openChartModal() {
    console.log('open chart modal');
  }

  async openProfileModal() {
    const modal = await this.modalController.create({
      component: ProfileModalPage,
    });
    return await modal.present();
  }

  startDataStream() {
    this.bluetoothService.startDataServices();
  }
}
