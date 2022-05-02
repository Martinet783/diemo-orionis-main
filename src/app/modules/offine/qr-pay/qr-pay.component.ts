import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as uuid from 'uuid';
import { sha256, sha224 } from 'js-sha256';
import * as CryptoJS from 'crypto-ts';
import { DbStorageService } from 'src/app/core/services/db_storage/db-storage.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { AES } from 'crypto-ts';
import { ModalController } from '@ionic/angular';
import { DownloadInfoComponent } from '../download-info/download-info.component';
import { Offline } from 'src/app/core/models/offline';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Router } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'qr-pay-component',
  templateUrl: './qr-pay.component.html',
  styleUrls: ['./qr-pay.component.scss'],
})
export class QrPayComponent implements OnInit {

  qr_number : number;
  qrForm : FormGroup;
  isSubmitted : boolean = false;
  showQR : boolean = false;
  dataQR : any;
  QR : any;
  balance : number;
  idWallet : string;
  secret_key_offline : string;
  numbers = interval(1000);
  countQR = this.numbers.pipe(take(11));
  dataOffline = new Offline();
  securityWorld : string;

  constructor(private formBuilder : FormBuilder,
              private dbStorageService : DbStorageService,
              private modalController : ModalController,
              private toastService : ToastService,
              private router : Router,
              private device: Device) { }

  ngOnInit() {
    this.presentModal();
    this.qrForm = this.formBuilder.group({
      amount : ['', Validators.required],
      pin_offline : ['', Validators.required],
      posId:['',Validators.required]
    })
  }

  get f(){ return this.qrForm.controls; }

  onSubmit(){
    this.isSubmitted = true;
    if(this.qrForm.invalid){return;}
    let qr_data = this.qrForm.value;
    if(qr_data.amount < 0 ){
      this.toastService.showToast('danger', 'ERROR', 'El monto debe ser positivo, por favor intente nuevamente');
      this.qrForm.reset();
      return;
    }
    if(qr_data.amount == 0 ){
      this.toastService.showToast('danger', 'ERROR', 'El monto debe ser mayor que cero, por favor intente nuevamente');
      this.qrForm.reset();
      return;
    }
    if(qr_data.amount > this.dataOffline.balance){
      this.toastService.showToast('danger', 'ERROR', 'El monto ingresado es mayor a su balance, por favor recargue o sincronice la aplicación');
      this.qrForm.reset();
      return;
    }

    qr_data.idWallet = this.dataOffline.trace_id;
    qr_data.reference = uuid.v4();
    qr_data.date = new Date().getTime();
    qr_data.deviceId = this.device.uuid

    delete qr_data.world;
    this.generateQR(qr_data, 
                    AES.encrypt(JSON.stringify(qr_data), 
                                sha256(qr_data.pin_offline))
                                .toString());
  }

  generateQR(dataQR : any, QR : any){
    
    this.dataQR = dataQR;
    this.QR = QR;
    this.showQR = true;
    this.qr_number = 10;
    this.isSubmitted = false;
    this.qrForm.reset();
    
    if(this.dbStorageService.verifyCollectionInDb('qr_generate')){
      let qr_generate = this.dbStorageService.getDataDb('qr_generate');
      qr_generate.push(dataQR);
      this.dataOffline.balance = this.dbStorageService.modifyBalance(dataQR.amount, this.securityWorld);
      this.dbStorageService.setInDb(qr_generate, 'qr_generate');
    }else{
      let arr = [];
      arr.push(dataQR);
      localStorage.setItem('qr_generate', JSON.stringify(arr));
      this.dataOffline.balance = this.dbStorageService.modifyBalance(dataQR.amount, this.securityWorld);
    }

    this.countQR.subscribe(x => {
      if(this.qr_number > 0){
        this.qr_number = this.qr_number - 1;
      }else if(this.qr_number == 0){
        this.showQR = false;
        this.isSubmitted = false;
        this.qrForm.reset();
      }
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: DownloadInfoComponent,
      cssClass: 'my-custom-class'
    });

    modal.onWillDismiss().then(data => {
      if(data.data.code){        
        this.securityWorld = data.data.code.code;
        let bytes  = AES.decrypt(localStorage.getItem('aes'), sha256(data.data.code.code));
        let plaintext = bytes.toString(CryptoJS.enc.Utf8);
        let crypt = JSON.parse(plaintext);
        this.dataOffline = crypt;
        if(new Date().getTime() > crypt.expiration_date*1000){
            this.toastService.showToast('banplus-dark', 'IMPORTANTE', 'TU SALDO OFFLINE SE HA EXPIRADO, POR FAVOR INICIA SESIÓN PARA SINCRONIZAR TU CUENTA', 5000);
            this.router.navigateByUrl('auth/signin');
        }
      }else{
        this.router.navigateByUrl('/auth/signin');
      }
    }).catch(error => {
      this.toastService.showToast('danger', 'ERROR', 'LA PALABRA DE SEGURIDA NO ES VÁLIDA');
      this.presentModal();
    })
    return await modal.present();
  }

  transform(num : number ){
    let number = num.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return number
  }


}
