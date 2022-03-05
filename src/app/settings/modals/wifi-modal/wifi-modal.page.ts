import { HttpClient } from '@angular/common/http';
import { Xliff } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { toastController } from '@ionic/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { WiFiCredential } from './wifi-credential.model';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

@Component({
  selector: 'app-wifi-modal',
  templateUrl: './wifi-modal.page.html',
  styleUrls: ['./wifi-modal.page.scss'],
})
export class WifiModalPage implements OnInit {
  scanningForWiFiNetworks = false;
  networks: Array<string> = undefined;
  selectedSSID: string;

  private scbAccessPointUrl = "https://192.168.4.1/";
  private scbWiFiManagerSSID = "SCB-Connection";
  
  //private scbAccessPointUrl = "http://localhost:3000/credentials";

  wiFiConnectionForm = new FormGroup({
    ssid: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private modalController: ModalController, 
    private http: HttpClient,
    private openNativeSettings: OpenNativeSettings,
    private httpBackend: HTTP) {
      this.httpBackend.setServerTrustMode("nocheck");
     }

  ngOnInit() {
  
  }

  dismiss() {
    this.modalController.dismiss();
  }

  navigateToWiFiSettings() {
    this.openNativeSettings.open("wifi").then(() => {
      console.log("Opened settings");
    })
    .catch(() => {
      console.log("Failed to open settings");
    })
  }

  scanWiFiNetworks() {
    this.scanningForWiFiNetworks = true;
    this.httpBackend.get(this.scbAccessPointUrl, {}, {}).then(networks => {
      const networkList = networks.data.split(',');
      
      if(this.networks === undefined) {
        this.networks = new Array<string>();
      }
      for (var networkSSID of networkList) {
        // todo find a better way to handle this, there legitimately could be wifi network names with less than 2 SSID
        if (networkSSID.length > 2) {
          this.networks.push(networkSSID);
        }
      }
      this.scanningForWiFiNetworks = false;
    })
    .catch(error => {
      this.scanningForWiFiNetworks = false;
      console.log(error);
    });
  }

  connectToWiFi() {
    if (this.wiFiConnectionForm.invalid)
      return;

    const wifiCredential = new WiFiCredential(
      this.wiFiConnectionForm.get('ssid').value,
      this.wiFiConnectionForm.get('password').value
    );

    this.httpBackend.post(this.scbAccessPointUrl, wifiCredential, {})
    .then((val) => {
      console.log("Transfered message", val);

      async () => {
        console.log("Completed message");
        const toast = await toastController.create({
        duration: 2000,
        message: 'Device connected to WiFi',
      });
      await toast.present();
      
    }})
  }
  
}
