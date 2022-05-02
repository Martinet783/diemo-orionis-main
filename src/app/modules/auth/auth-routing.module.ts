import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [{path: '', 
                         children: [
                            {path: 'signin', component: SigninComponent},
                            {path: 'signup', component: SignupComponent},
                            {path: 'forgot/password', component: ForgotPasswordComponent}
                          ]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
