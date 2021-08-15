import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { BluetoothService } from 'src/app/settings/bluetooth/bluetooth.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { PumpPIDTuningDataPayload } from 'src/app/settings/bluetooth/pump-pid.data-payload.model';

@Component({
  selector: 'app-pump-pid-modal',
  templateUrl: './pump-pid-modal.page.html',
  styleUrls: ['./pump-pid-modal.page.scss'],
})
export class PumpPidModalPage implements OnInit {
  private dataPayloadSubscription: Subscription;

  currentPumpPressure = 4;
  pumpPressureTarget = 9;

  dataSets: ChartDataSets[] = [
    { data: [], label: "Pressure", fill: false, yAxisID: 'Pressure' },
    { data: [], label: "Power", fill: false, yAxisID: 'Power' }
  ];

  chartOptions: ChartOptions = {
    animation: {
      duration: 0
    },
    scales: {
      yAxes: [{
        id: 'Pressure',
        type: 'linear',
        position: 'left',
        ticks: {
          max: 15,
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

      this.bluetoothService.pumpTuningPayload.subscribe(payload => {
        this.zone.run(() => {
          this.pushToChart(payload);
          this.currentPumpPressure = payload.pumpPressure;
          this.pumpPressureTarget = payload.pumpPressureTarget;
        })
      }, error => {
        console.log("GOT PID PAYLOAD MODAL ERROR");
        console.log(error);
      })

    }

    dismiss() {
      if (this.dataPayloadSubscription) {
        this.dataPayloadSubscription.remove;
      }
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.modalController.dismiss();
    }

    private pushToChart(payload: PumpPIDTuningDataPayload) : void {
      if (this.dataSets[0].data.length > 60) {
        this.dataSets[0].data = this.dataSets[0].data.slice(1);
        this.dataSets[1].data = this.dataSets[1].data.slice(1);
        this.dataLabels = this.dataLabels.slice(1);
      }
      this.dataSets[0].data.push(payload.pumpPressure);
      this.dataSets[1].data.push(payload.dimmerPower);
      this.dataLabels.push(payload.cycleTime.toString());
    }

    sendPidSettings() {
      console.log("sending to server");
    }

}
