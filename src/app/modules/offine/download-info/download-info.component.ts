import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-ts';
import { sha256 } from 'js-sha256';
import { UserService } from 'src/app/core/services/user/user.service';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'app-download-info',
  templateUrl: './download-info.component.html',
  styleUrls: ['./download-info.component.scss'],
})
export class DownloadInfoComponent implements OnInit {
  
  @Input()infoOffline : any;
  faTimes = faTimes;
  faSpinner = faSpinner;
  isSubmitted : boolean = false;
  loading : boolean = false;
  validateCodeForm : FormGroup;
  sha256 = sha256;
  showDiscard = true

  constructor(private formBuilder : FormBuilder,
              private modalControler : ModalController,
              private userService : UserService,
              private toastService : ToastService,
              private router : Router,
              private device: Device) { }

  ngOnInit() {
    this.validateCodeForm = this.formBuilder.group({
      code : ['', Validators.required]
    })
    if(this.infoOffline == undefined){
      this.showDiscard = false
    }
  }

  get f(){ return this.validateCodeForm.controls; }

  close(code = null, dismissed : boolean = false){
    this.modalControler.dismiss({
      'dismissed': dismissed,
      'code': code,
      'delete':false
    });
  }

  walletOfflineBalance(){
    this.loading = true;
    var req = {'device_id':this.device.uuid}
    this.userService.getWalletOfflineBalance(req).subscribe(data => {
      this.loading = false;
      if(data.data){
        this.infoOffline = data.data;
      }
    }, error => {
      this.loading = false;
    })
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.validateCodeForm.invalid){
      return;
    }
    this.validateCode(this.validateCodeForm.value)
  }

  validateCode(req){
    if(this.infoOffline){
      let sha256 =  this.sha256(req.code);
      const encryptedMessage = CryptoJS.AES.encrypt(JSON.stringify(this.infoOffline), sha256).toString();
      localStorage.setItem('aes', encryptedMessage);
      this.toastService.showToast('diemo-info', 'ÉXITO' , 'PERFIL OFFLINE SINCRONIZADO.', 4000);
      this.close(null, true);
    }else{
      this.close(req);
    }
  }

  cancelar(){
    this.modalControler.dismiss({
      'dismissed': false,
      'code': null,
      'delete':true
    });
  }
}
