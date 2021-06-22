import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Profile } from 'src/app/common/profiles/profile.model';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.page.html',
  styleUrls: ['./profile-modal.page.scss'],
})
export class ProfileModalPage implements OnInit {
  currentProfile: Profile;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.currentProfile = new Profile('Single Origin 18gram', 85, 9, 10, 30);

  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
