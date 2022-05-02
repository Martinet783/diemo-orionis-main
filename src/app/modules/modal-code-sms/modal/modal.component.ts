import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { DisplayModalService } from '../service/display-modal.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  faTimes = faTimes;
  isSubmitted : boolean = false;
  validateCodeForm : FormGroup;

  constructor(private formBuilder : FormBuilder,
              private modalControler : ModalController,
              private displayService : DisplayModalService,
              private authService : AuthService,
              private toastService : ToastService,
              private router : Router) { }

  ngOnInit() {
    this.validateCodeForm = this.formBuilder.group({
      smsCode : ['', Validators.required]
    })
  }

  close(){
    this.modalControler.dismiss({
      'dismissed': true
    });
    this.displayService.setShow(false);
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.validateCodeForm.invalid){return ;}
    this.smsCodeSend(this.validateCodeForm.value)
  }

  smsCodeSend(req : any){
    this.authService.walletAuthCheckSMSCode(req).subscribe(data => {
      if(data.data){
        this.toastService.showToast("success", "ÉXITO", data.data);
        this.close();
      }
    }, error =>{
      if(error.error.code){
        this.toastService.showToast("banplus-neutral", "IMPORTANTE", error.error.msg)
      }
    })
  }

  resendSmsCode(){
    let user : User = JSON.parse(localStorage.getItem('user_login'));
    let req = { "user" : user.user};
    this.authService.resendSMSCode(req).subscribe(data => {
      if(data.data){
        this.toastService.showToast("success", "ÉXITO", data.data)
      }
    }, error =>{
      if(error.error.code){
        this.toastService.showToast("banplus-neutral", "IMPORTANTE", error.error.msg)
      }
    })
  }

}
