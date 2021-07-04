import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Profile } from './profile.model';
import { Storage } from '@ionic/storage'; // This line added manually.


@Injectable({
  providedIn: 'root'
})
export class ProfileService{
  currentProfile: Subject<Profile> = new Subject<Profile>();

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const profiles = await this.storage.get("profiles") as Array<Profile>;

    if (profiles === null) {
      console.log("no profiles saved");
      const newProfile = Array<Profile>();
      await this.storage.set("profiles", newProfile);
    } else {
      const currentProfile = profiles.find(s => s.selected === true);
      this.currentProfile.next(currentProfile)
    }
  }


  async createNewProfile(profile: Profile) {
    if (!profile) {
      return null;
    }

    const profiles =  await this.storage.get("profiles") as Array<Profile>;
    if (profiles === null) {
      const newProfile = Array<Profile>();
      this.currentProfile.next(profile);
      newProfile.push(profile);
      await this.storage.set("profiles", newProfile);
      return;

    } else if (profiles.length === 0) {
      profile.selected = true;
    }
    profiles.push(profile);
    this.currentProfile.next(profile);
    await this.storage.set("profiles", profiles);
  }

  async getProfiles() : Promise<Profile[]> {
    return await this.storage.get("profiles");
  }

  async deleteProfile(id: string) {
    const profiles =  await this.storage.get("profiles") as Array<Profile>;
    const index = profiles.findIndex(p => p.id === id);
    profiles.splice(index, 1);
    this.currentProfile.next(undefined);
    await this.storage.set("profiles", profiles);
    return profiles;
  }

  async selectProfile(id: string) {
    const profiles = await this.storage.get("profiles") as Array<Profile>;
    const index = profiles.findIndex(p => p.id === id);
    profiles.forEach(function (profile) {
      profile.selected = false;
    });

    const profile = profiles[index];

    profile.selected = true;
    this.currentProfile.next(profile);
    await this.storage.set("profiles", profiles);
  }

}
