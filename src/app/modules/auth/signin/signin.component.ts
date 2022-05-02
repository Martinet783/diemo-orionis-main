import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/user';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { sha256, sha224 } from 'js-sha256';
import { DisplayModalService } from '../../modal-code-sms/service/display-modal.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { TokenFirebaseService } from 'src/app/core/services/token-firebase/token-firebase.service';
import { DbStorageService } from 'src/app/core/services/db_storage/db-storage.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {

  signinForm : FormGroup;
  submitted : boolean;
  showModalSms : boolean = false;
  password : string;
  user : User;
  error : boolean;
  loading : boolean = false;
  finger : boolean = false;
  faSpinner = faSpinner;
  firebaseToken : string;

  pwdIcon = "eye-outline";
  showPwd = false;

  constructor(public router : Router,  
              private formBuilder : FormBuilder,
              private toastService : ToastService,
              private dbStorage : DbStorageService,
              private authService : AuthService,
              private faio : FingerprintAIO,
              private nativeStorage : NativeStorage,
              private displayService : DisplayModalService,
              private firebaseService : TokenFirebaseService,
              private device: Device) { }

  ngOnInit() {
    localStorage.removeItem('user');
    localStorage.removeItem('X-Refresh');
    localStorage.removeItem('Authorization');

    this.signinForm = this.formBuilder.group({
      user : ['', [Validators.required]],
      password : ['', [Validators.required]],
    })
    
    this.showModalConfirmationCode();

    this.firebaseService.tokenObservable.subscribe(data => {
      if(data != null){
        this.firebaseToken = data;
      }
    })

    this.nativeStorage.getItem('faio')
    .then(data => {
        if(data){
          this.finger = true;
        }
      },error => console.error(error));
  }

  togglePwd(){
    this.showPwd = !this.showPwd;
    this.pwdIcon = this.showPwd ? "eye-off-outline" : "eye-outline";
  }

  loadBiometricSecret(){
    this.faio.loadBiometricSecret({disableBackup : true}).then(data => {
      let user = { finger_key : data, device_token: this.firebaseToken, device : "mobile",device_id : this.device.uuid }
      this.loading = true;
      this.authService.fingerLogin(user).subscribe(data => {
        console.log(data);
        this.loading = false;
        if(data.data){
          this.loginSuccess(data);
        }
      }, error => {
        this.loading = false;
        if(error.error.code === 557){
          this.showModalSms = true;
        }else{
          this.toastService.showToast("danger", "ERROR", error.error.msg, 4000);
        }
      })
    }, error => {
      // console.log(error);
    })
  }

  get f(){ return this.signinForm.controls; }

  onSubmit(){
    this.submitted = true;
    if(this.signinForm.invalid){return;}
    
    let user : User = this.signinForm.value;
    if(this.error){
      user.password = this.f.password.value;
    }

    if (user.user.startsWith('58')){
      user.user = user.user
    }
    else if (isNaN(Number(user.user))){
      user.user = user.user.toLocaleLowerCase();
    }
    else if (Number(user.user) != NaN){
      user.user = '58' + Number(user.user);
    }
    user.password = sha256(user.password);
    user.device_token = this.firebaseToken;
    user.device = 'mobile';
    user.device_id = this.device.uuid
    this.signIn(user);
  }

  signIn(user : User, type : string = "app"){
    this.loading = true;
    this.authService.authSignin(user).subscribe(data => {
      this.error = false;
      this.loading = false;
      if(data.data){
        this.loginSuccess(data);
      }
      if(data.code){
          this.toastService.showToast("banplus-neutral", "IMPORTANTE", data.msg, 4000);
      }
    }, error => {
        this.loading = false;
        this.error = true;
        localStorage.setItem("user_login", JSON.stringify(user));
        if(error.error.code === 557){
          this.showModalSms = true;
        }else{
          this.toastService.showToast("danger", "ERROR", error.error.msg, 4000);
        }
    })
  }

  showModalConfirmationCode(){
    this.displayService.modalObservable.subscribe(data => {
      if(data != null){
          this.showModalSms = data;
      }
    })
  }

  loginSuccess(data : any){
    this.signinForm.reset();
    this.submitted = false;
    localStorage.setItem('Authorization', 'Bearer '+ data.data.token);
    localStorage.setItem('X-Refresh', 'Bearer '+ data.data.refresh);
    localStorage.setItem('idWallet', data.data.trace_id);
    this.dbStorage.sync(data.data.trace_id);
    localStorage.removeItem('user_login');
    let user : User = data.data;
    localStorage.setItem('user', JSON.stringify(data.data));
    
    this.router.navigateByUrl('home');
  }
}
