import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';
import { ChangePinComponent } from './change-pin/change-pin.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { InviteFriendsComponent } from './invite-friends/invite-friends.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: ProfilePage},
      {path: 'pin', component: ChangePinComponent},
      {path: 'password', component: ChangePasswordComponent},
      {path: 'friends', component: InviteFriendsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
