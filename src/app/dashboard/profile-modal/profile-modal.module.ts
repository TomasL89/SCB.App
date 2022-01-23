import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileModalPageRoutingModule } from './profile-modal-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProfileModalPage } from './profile-modal.page';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfileModalPageRoutingModule,
    MatExpansionModule,
    ChartsModule
  ],
  declarations: [ProfileModalPage]
})
export class ProfileModalPageModule {}
