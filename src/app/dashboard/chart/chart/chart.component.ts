import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { DataPayload } from 'src/app/settings/bluetooth/bluetooth.data-payload.model';
import { BluetoothService } from 'src/app/settings/bluetooth/bluetooth.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit{

  datasets: ChartDataSets[] = [
    { data: [], label: 'Temperature', fill: false, yAxisID: 'Temp' },
    { data: [], label: 'Pressure', fill: false, yAxisID: 'Pres' },
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
        id: 'Pres',
        type: 'linear',
        position: 'right',
        ticks: {
          max: 15,
          min: 0
        }
      }]
    }
  };

  dataLabels: Label[] = [];

  constructor(private bluetoothService: BluetoothService) {}

  ngOnInit(): void {
    this.bluetoothService.payload.subscribe(payload => {
      console.log(`PAYLOAD: ${payload.boilerTemp}  -- ${payload.cycleTime}`)
      this.pushToChart(payload);
    })
  }

  private pushToChart(payload: DataPayload) : void{
    if (this.datasets[0].data.length > 60) {
      this.datasets[0].data = this.datasets[0].data.slice(1);
      this.datasets[1].data = this.datasets[1].data.slice(1);
      this.dataLabels = this.dataLabels.slice(1);
    }
    this.datasets[0].data.push(payload.boilerTemp);
    this.datasets[1].data.push(payload.pumpPressure);
    this.dataLabels.push(payload.cycleTime.toString());

  }
}
