import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm : FormGroup;
  verifyForm : FormGroup;
  isSubmitted : boolean;
  isSubmittedVerify : boolean;
  faSpinner = faSpinner;
  ci_verify : string;
  verify : boolean = false;
  loading : boolean = false;
  new_password : boolean = false;

  constructor(private formBuilder : FormBuilder,
              private router : Router,
              private authService : AuthService,
              private toastService : ToastService) { }

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      emailID : ['', [Validators.required, Validators.email]]
    })
    this.verifyForm = this.formBuilder.group({
      code : ['', [Validators.required, Validators.pattern('[0-9]*')]]
    })
  }

  get f(){ return this.forgotForm.controls; }
  get vf(){ return this.verifyForm.controls; }

  goTo(path : string){ this.router.navigateByUrl(path); }

  onSubmit(){
    this.isSubmitted = true;
    if(this.forgotForm.invalid){ return; }

    let email = this.forgotForm.value['emailID'].toLowerCase();
    this.recoveryPassword(email);
  }

  onSubmitVerify(){
    this.isSubmittedVerify = true;
    if(this.verifyForm.invalid){ return; }
    this.veifyCode(this.verifyForm.value['code'], this.ci_verify);
  }

  recoveryPassword(email : string){
    this.loading = true;
    this.authService.authRecoveryPassword({'emailID': email}).subscribe(data => {
      this.loading = false;
      if(data.code == 517){
        this.toastService.showToast('danger', 'ERROR', data.msg);
      }else if(data.userId){
        this.ci_verify = data.userId; 
        this.verify = true;
      }
    }, error => {
      this.loading = false;
      if(error.error.code){
        this.toastService.showToast('danger', 'ERROR', error.error.msg)
      }
    })
  }

  veifyCode(code : string, ci : string){
    this.loading = true;
    this.authService.authVerifyCode(code, ci).subscribe(data => {
      this.loading = false;
      this.new_password = true;
    }, error =>{
      this.loading = false;
      if(error.error.code){
        this.toastService.showToast('danger', 'ERROR', error.error.msg)
      }
    })
  }

}
