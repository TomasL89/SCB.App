import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BluetoothService } from 'src/app/settings/bluetooth/bluetooth.service';
import { Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { BoilerPIDTuningDataPayload } from 'src/app/settings/bluetooth/boiler-pid.data-payload.model';

@Component({
  selector: 'app-boiler-pid-modal',
  templateUrl: './boiler-pid-modal.page.html',
  styleUrls: ['./boiler-pid-modal.page.scss'],
})
export class BoilerPidModalPage implements OnInit {
  private dataPayloadSubscription: Subscription;

  vhiMax = 0;
  vlowMin = 0;
  boilerTarget = 0;
  currentBoilerTemp = 100;
  boilerTempTarget = 85;


  dataSets: ChartDataSets[] = [
    { data: [], label: "Temperature", fill: false, yAxisID: 'Temp'},
    { data: [], label: 'Power', fill: false, yAxisID: 'Power'}
  ];

  chartOptions: ChartOptions = {
    animation: {
      duration: 0
    },
    scales: {
      yAxes: [{
        id: 'Temp',
        type: 'linear',
        position: 'left',
        ticks: {
          max: 115,
          min: 0
        }
      }, {
        id: 'Power',
        type: 'linear',
        position: 'right',
        ticks: {
          max: 100,
          min: 0
        }
      }]
    }
  };

  dataLabels: Label[] = [];

  constructor(
    private modalController: ModalController,
    private screenOrientation: ScreenOrientation,
    private bluetoothService: BluetoothService,
    private zone: NgZone) { }

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

    this.bluetoothService.boilerTuningPayload.subscribe(payload => {
      this.zone.run(() => {
        this.pushToChart(payload);
        this.currentBoilerTemp = payload.boilerTemp;
        this.boilerTarget = payload.boilerTarget;
      })
    }, error => {
      console.log("GOT PID PAYLOAD MODAL ERROR");
      console.log(error);
    })

  }

  sendPidSettings() {
    console.log("sending PID settings");
  }

  dismiss() {
    if (this.dataPayloadSubscription) {
      this.dataPayloadSubscription.remove;
    }
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.modalController.dismiss();
  }

  private pushToChart(payload: BoilerPIDTuningDataPayload) : void {
    if (this.dataSets[0].data.length > 60) {
      this.dataSets[0].data = this.dataSets[0].data.slice(1);
      this.dataSets[1].data = this.dataSets[1].data.slice(1);
      this.dataLabels = this.dataLabels.slice(1);
    }
    this.dataSets[0].data.push(payload.boilerTemp);
    this.dataSets[1].data.push(payload.dimmerPower);
    this.dataLabels.push(payload.cycleTime.toString());
  }

  private calculateVHi(boilerTarget: number, actualBoilerTemp: number) : number {
    if (actualBoilerTemp > boilerTarget) {
      const vhiDiff = actualBoilerTemp - boilerTarget;
      this.vhiMax = vhiDiff > this.vhiMax ? vhiDiff : this.vhiMax;
      this.vhiMax +=  boilerTarget;
    }
    return this.vhiMax;
  }

  private calculateVlo(boilerTarget: number, actualBoilerTemp: number) : number {
    if (actualBoilerTemp < boilerTarget) {
      const vhiDiff = boilerTarget - actualBoilerTemp;
      this.vlowMin = vhiDiff < this.vlowMin ? vhiDiff : this.vlowMin;
      this.vlowMin -= boilerTarget;
    }
    return this.vlowMin;
  }
}
