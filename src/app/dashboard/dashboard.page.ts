import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Profile } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { Device } from '../settings/bluetooth/bluetooth.device.model';
import { BluetoothService } from '../settings/bluetooth/bluetooth.service';
import { BluetoothModalPage } from '../settings/modals/bluetooth-modal/bluetooth-modal.page';
import { ChartModalPage } from './chart-modal/chart-modal/chart-modal.page';
import { ProfileModalPage } from './profile-modal/profile-modal.page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  boilerTemperature: number = 0;
  steamTemperature: number = 0;
  currentProfile: Profile;
  device: Device = undefined;
  displayName: string = "No device connected"

  private profileSubscription: Subscription;
  private dataPayloadSubscription: Subscription;
  private deviceSubscription: Subscription;

  constructor(
    public modalController: ModalController,
    private profileService: ProfileService,
    private bluetoothService: BluetoothService,
    private ngZone: NgZone,
    private orientation: ScreenOrientation
  ) {}

  ngOnInit() {
    this.orientation.lock(this.orientation.ORIENTATIONS.PORTRAIT);

    this.deviceSubscription = this.bluetoothService.device.subscribe(device => {
      this.ngZone.run(() => {
        this.device = device;
        console.log("GOT DEVICE IN DASHBOARD")
        this.displayName = device.name;
      });
    });
    this.dataPayloadSubscription = this.bluetoothService.payload.subscribe(payload => {
      this.ngZone.run(() => {
        this.boilerTemperature = payload.boilerTemp;
        this.steamTemperature = payload.steamTemp;
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

  }

  async openBluetoothModal() {
    const modal = await this.modalController.create({
      component: BluetoothModalPage
    });
    return await modal.present();
  }

  async openChartModal() {
    const modal = await this.modalController.create({
      component: ChartModalPage
    });
    return await modal.present();
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
