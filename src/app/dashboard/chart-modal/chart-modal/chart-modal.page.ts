import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-chart-modal',
  templateUrl: './chart-modal.page.html',
  styleUrls: ['./chart-modal.page.scss'],
})
export class ChartModalPage implements OnInit {
  boilerTemp: number = 115;
  steamTemp: number = 115;
  pumpPressure: number = 10;
  boilerPower: number = 90;
  pumpPower: number = 90;

  constructor(private modalController: ModalController, private screenOrientation: ScreenOrientation) { }

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  dismiss() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.modalController.dismiss();
  }

}
