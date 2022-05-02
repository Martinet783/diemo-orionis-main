import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ModalCodeSmsModule } from '../modal-code-sms/modal-code-sms.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChangePasswordComponent } from './forgot-password/change-password/change-password.component';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


@NgModule({
  declarations: [SignupComponent, SigninComponent, ForgotPasswordComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    IonicModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalCodeSmsModule,
    FontAwesomeModule
  ],
  providers: [FingerprintAIO, NativeStorage]
})
export class AuthModule { }
