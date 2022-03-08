import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { AzureStorageService } from '../../azure-storage/azure-storage.service.service';
import { BluetoothService } from '../../bluetooth/bluetooth.service';
import { Version } from './firmware-info.model';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Component({
  selector: 'app-firmware-update-modal',
  templateUrl: './firmware-update-modal.page.html',
  styleUrls: ['./firmware-update-modal.page.scss'],
})
export class FirmwareUpdateModalPage implements OnInit {

  private fwManifest = "scb-fw-info.json";
  // todo change the name of this as it really reads as smart coffee board board (scb-board)
  private boardHostName = "scb-board:81";
  private tmpdir = "tmp/fw/"
  private progressSubject = webSocket("ws://scb-board:81/ws");

  selectedFirmwareVersion: Version;
  //firmwareInfo: any;
  firmwareInfo = Array<Version>();
  selectedFirmwareVersionData: Version;

  constructor(
    private modalController: ModalController,
    private bluetoothService: BluetoothService,
    private blobService: AzureStorageService,
    private platform: Platform) {
      this.platform.ready().then((ready) => {
        this.progressSubject.subscribe((data) => {
          console.log(`Progress: ${data}`);
        })
      })
     }

  ngOnInit() {
    this.downloadFwVersionManifest();
  }

  updateDeviceFirmware() {
    this.bluetoothService.startFirmwareUpdate();

    console.log('Downloading blob');
    this.blobService.downloadFw(this.selectedFirmwareVersion.uri);
    console.log('Finished downloading blob');
  }

  dismiss() {
    this.modalController.dismiss();
  }

  private async downloadFwVersionManifest() {
    this.blobService.downloadFwVersion(this.fwManifest, async blob => {
      let downloadStream = blob.text();
      downloadStream.then(value => {
        let firmwareData = JSON.parse(value);
        for (var i = 0; i < firmwareData.Versions.length; i++) {
          this.firmwareInfo.push(new Version(
              firmwareData.Versions[i].Version,
              firmwareData.Versions[i].ReleaseDate,
              firmwareData.Versions[i].URI,
              firmwareData.Versions[i].Features,
              firmwareData.Versions[i].BugFixes
            ))
        }
      })
    })
  }
}
