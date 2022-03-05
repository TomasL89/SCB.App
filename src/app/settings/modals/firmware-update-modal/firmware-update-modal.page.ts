import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Readable } from 'stream';
import { AzureStorageService } from '../../azure-storage/azure-storage.service.service';
import { BluetoothService } from '../../bluetooth/bluetooth.service';
import { Version } from './firmware-info.model';

@Component({
  selector: 'app-firmware-update-modal',
  templateUrl: './firmware-update-modal.page.html',
  styleUrls: ['./firmware-update-modal.page.scss'],
})
export class FirmwareUpdateModalPage implements OnInit {

  private fwManifest = "scb-fw-info.json";

  selectedFirmwareVersion: Version;
  //firmwareInfo: any;
  firmwareInfo = Array<Version>();
  selectedFirmwareVersionData: Version;

  constructor(
    private modalController: ModalController,
    private bluetoothService: BluetoothService,
    private blobService: AzureStorageService) { }

  ngOnInit() {
    this.downloadFwVersionManifest();
  }

  updateDeviceFirmware() {
    this.bluetoothService.startFirmwareUpdate();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  logSelectedItem() {
    // this.selectedFirmwareVersion = this.firmwareInfo.filter.find(e => e.version === this.selectedFirmwareVersion);
    // //console.log(this.selectedFirmwareVersionData);
    // this.selectedFirmwareVersion = new Version(
    //   this.selectedFirmwareVersionData.Version,
    //   this.selectedFirmwareVersionData.ReleaseDate,
    //   this.selectedFirmwareVersionData.URI,
    //   this.selectedFirmwareVersionData.Features,
    //   this.selectedFirmwareVersionData.BugFixes
    // );
    console.log(this.selectedFirmwareVersionData);

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
