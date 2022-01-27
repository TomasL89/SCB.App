import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Profile } from 'src/app/profile/profile.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfileService } from 'src/app/profile/profile.service';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ChartConfiguration, ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';


@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.page.html',
  styleUrls: ['./profile-modal.page.scss'],
})
export class ProfileModalPage implements AfterViewInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;


  profileSubscription: Subscription;
  currentProfile: Profile;
  profiles: Array<Profile>;
  isEditMode: boolean;
  isLibraryMode: boolean;
  isComplexEditMode: boolean;
  complexProfile: Array<number> = new Array(60).fill(0);
  selectedComplexProfile: ComplexProfile
  // defaultComplexProfiles: Array<[string, Array<number>]> = 
  // [
  //   ['Flat 9', new Array(60).fill(9)],
  //   ['Preinfusion Flat 9', new Array(60).fill(3,0,9).fill(9,10,29)]
  // ]
  defaultComplexProfiles: Array<ComplexProfile> = 
  [
    new ComplexProfile('Flat 9', new Array(60).fill(9)),
    new ComplexProfile('Flat 9 Preinfusion', new Array(60).fill(3,0,9).fill(9,9,29))
  ]

  private profilePosition = 0;
  private pointBackgroundColors = ['green']

  datasets: ChartDataSets[] = [
    { data: this.complexProfile, 
      label: 'Pressure', 
      fill:true, 
      yAxisID: 'Bar', 
      pointBackgroundColor: this.pointBackgroundColors.fill('red', 1, 59)}
  ]

  chartOptions: ChartOptions = {
    scales: {
      yAxes: [{
        id: 'Bar',
        type: 'linear',
        position: 'left',
        ticks: {
          max: 12,
          min: 0
        },
      }],
    },
    plugins: {
      dragData: true
    }
    }

  dataLabels: Label[] = Array.from({length: 60}, (_, i) => (i + 1).toString());

  profileForm = new FormGroup({
    name: new FormControl(''),
    boilerTemperature: new FormControl(''),
    pumpPressure: new FormControl(''),
    preInfusionTime: new FormControl(''),
    shotTime: new FormControl('')
  })

  complexProfileForm = new FormGroup({
    name: new FormControl(''),
    boilerTemperature: new FormControl(''),
    profileData: new FormControl('')
  });

  constructor(
    private modalController: ModalController,
    private profileService: ProfileService,
    private screenOrientation: ScreenOrientation) {

  }

  ngAfterViewInit(): void {
    this.profileSubscription = this.profileService.currentProfile.subscribe(profile => {
      this.currentProfile = profile;
      console.log(profile);
    }, (error => {
      console.error(error);
    }));

    this.profileService.getProfiles().then(profiles => {
      this.profiles = profiles;
      console.log(profiles);
    });

  }

  dismiss() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.modalController.dismiss({
      'dismissed': true
    });
  }

  enableEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  enableComplexEditMode() {
    this.isComplexEditMode = !this.isComplexEditMode;
    if (this.isComplexEditMode) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    }
  }

  updateChart(event) {
    this.complexProfile = event.detail.value.profile;
    this.chart.datasets[0].data = this.complexProfile;
    this.chart.update();
  }

  updateBaseLinePressure(event) {
    this.complexProfile = new Array(60).fill(+event.detail.value);
    this.chart.datasets[0].data = this.complexProfile;
    this.chart.update();
  }

  enableLibraryMode() {
    this.isLibraryMode = !this.isLibraryMode;
  }

  saveProfile() {
    if (this.profileForm.invalid)
      return;
    // todo fix the input later
    const name = this.profileForm.get('name').value;
    const boilerTemp = this.profileForm.get('boilerTemperature').value.replace(/\D/g,'');
    const pumpPressure = this.profileForm.get('pumpPressure').value.replace(/\D/g,'');
    const preInfusionTime = this.profileForm.get('preInfusionTime').value.replace(/\D/g,'');
    const shotTime = this.profileForm.get('shotTime').value.replace(/\D/g,'');
    let id = uuidv4();
    const newProfile = new Profile(String(id) ,name, boilerTemp, pumpPressure, preInfusionTime, shotTime, false);

    this.profileService.createNewProfile(newProfile);
    this.currentProfile = newProfile;
    this.dismiss();
  }

  selectProfile(id: string) {
    this.profileService.selectProfile(id);
    this.dismiss();
  }

  deleteProfile(id: string) {
    this.profileService.deleteProfile(id).then(profiles => {
      console.log(profiles);
      this.profiles = profiles;
    })
  }



  adjustPressure(direction: string) {

    if (direction==='up') {
      if (this.complexProfile[this.profilePosition] <= 12) {
        this.complexProfile[this.profilePosition] = this.complexProfile[this.profilePosition] + 1;
      }
    }
    else if (direction ==='right') {
      if (this.profilePosition <= 59) {
        this.profilePosition += 1;
        this.chart.datasets[0].pointBackgroundColor[this.profilePosition] = 'green'
        this.chart.datasets[0].pointBackgroundColor[this.profilePosition -1] = 'red'
      }
      else {
        this.profilePosition = 0;
      }
    }
    else if (direction ==='down') {
      if (this.complexProfile[this.profilePosition] > 0) {
        this.complexProfile[this.profilePosition] = this.complexProfile[this.profilePosition] - 1;
      }
    }
    else if (direction ==='left') {
      if (this.profilePosition > 0) {
        this.profilePosition -= 1;
        this.chart.datasets[0].pointBackgroundColor[this.profilePosition] = 'green'
        this.chart.datasets[0].pointBackgroundColor[this.profilePosition + 1] = 'red'
      }
      else {
        this.profilePosition = 0;
      }
    }
    this.chart?.update();
  }


  editProfile(id: string) {

  }
}

class ComplexProfile {
  name: String
  profile: Array<number>

  constructor(name, profile) {
    this.name = name;
    this.profile = profile
  }
}