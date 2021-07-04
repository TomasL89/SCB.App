import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Profile } from 'src/app/profile/profile.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfileService } from 'src/app/profile/profile.service';
import { Subscription } from 'rxjs';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.page.html',
  styleUrls: ['./profile-modal.page.scss'],
})
export class ProfileModalPage implements AfterViewInit {
  profileSubscription: Subscription;
  currentProfile: Profile;
  profiles: Array<Profile>;
  isEditMode: boolean;
  isLibraryMode: boolean;

  profileForm = new FormGroup({
    name: new FormControl(''),
    boilerTemperature: new FormControl(''),
    pumpPressure: new FormControl(''),
    preInfusionTime: new FormControl(''),
    shotTime: new FormControl('')
  })

  constructor(private modalController: ModalController, private profileService: ProfileService) {

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
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  enableEditMode() {
    this.isEditMode = !this.isEditMode;
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

  editProfile(id: string) {

  }
}
