import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ModalController } from '@ionic/angular';
import { BoilerPidModalPage } from './boiler-pid-modal/boiler-pid-modal/boiler-pid-modal.page';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.page.html',
  styleUrls: ['./configuration.page.scss'],
})
export class ConfigurationPage implements OnInit {

  constructor(
    public modalController: ModalController,
    private orientation: ScreenOrientation
  ) { }

  ngOnInit() {
    this.orientation.lock(this.orientation.ORIENTATIONS.PORTRAIT);
  }

  async openBoilerPidModal() {
    const modal = await this.modalController.create({
      component: BoilerPidModalPage
    });
    return await modal.present();
  }

}
