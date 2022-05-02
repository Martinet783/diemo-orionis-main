import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { ChangePinComponent } from './change-pin/change-pin.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { InviteFriendsComponent } from './invite-friends/invite-friends.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [ProfilePage, ChangePinComponent, ChangePasswordComponent, InviteFriendsComponent],
  providers : [NativeStorage]
})
export class ProfilePageModule {}
