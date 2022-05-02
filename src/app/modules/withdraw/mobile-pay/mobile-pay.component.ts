import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/core/services/user/user.service';
import { Withdraw } from 'src/app/core/models/withdraw';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { HomeRefreshService } from 'src/app/core/services/home-refresh/home-refresh.service';
import { Transactions } from 'src/app/core/models/transactions';
import { sha256 } from 'js-sha256';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'mobile-pay-withdraw',
  templateUrl: './mobile-pay.component.html',
  styleUrls: ['./mobile-pay.component.scss'],
})
export class MobilePayComponent implements OnInit {

  transferForm : FormGroup;
  isSubmitted : boolean = false;
  loading : boolean = false;
  transaction : Transactions;
  bankCode = '0174'; //banplus
  affiliate : boolean = false;
  faSpinner = faSpinner;

  divisa : string;

  constructor(private formBuilder : FormBuilder,
              private userService : UserService,
              private modalController : ModalController,
              private toastService : ToastService,
              private router : Router,
              private homeRefreshService : HomeRefreshService,
              public alertController: AlertController) { }

  ngOnInit() {

    this.transferForm = this.formBuilder.group({
      amount : ['', [Validators.required, Validators.pattern('[0-9]*?.*?[0-9]*')]],
      pin : ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]{4}$')]],
    })

    this.divisa = localStorage.getItem('divisa');
  }

  get f(){ return this.transferForm.controls; }

  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'CONFIRMACIÓN',
      subHeader: '',
      message: '¿Está seguro que desea realizar el retiro a su cuenta Banplus?',
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'ACEPTAR',
          handler: () => {
            
            let form = this.transferForm.value;
            let withdraw = new Withdraw();

            withdraw.BankCode = this.bankCode;
            withdraw.setForm(form)
            withdraw.Pin = sha256(String(form.pin));
            this.walletMoneyWithdraw(withdraw);
          }
        }
      ]
    });

    await alert.present();
    

  }

  submitForm(){
    this.isSubmitted = true;
    if(this.transferForm.invalid){ return; }
    this.presentAlertMultipleButtons()

    /*this.isSubmitted = true;
    if(this.transferForm.invalid){ return; }

    let form = this.transferForm.value;
    let withdraw = new Withdraw();

    withdraw.BankCode = this.bankCode;
    withdraw.setForm(form)
    withdraw.Pin = sha256(String(form.pin));
    this.walletMoneyWithdraw(withdraw);*/
  }

  walletMoneyWithdraw(req : any){
    this.loading = true;
    console.log(req);
    this.userService.walletMoneyWithdraw(req).subscribe(data => {
      this.loading = false;
      // console.log(data);
      if(data){
        this.transferForm.reset()
        this.isSubmitted = false;
        this.toastService.showToast('success', 'ÉXITO', 'RETIRO REALIZADO.');
        this.router.navigateByUrl('/home');
        this.homeRefreshService.setRefresh(true);
      }
    }, error => {
      this.loading = false;
      if(error.error?.code){
        this.toastService.showToast('danger', 'ERROR', error.error.msg);
      }
      if(error?.name == "TimeoutError"){
        this.toastService.showToast('danger', 'ERROR', 'HUBO UN PROBLEMA DE COMUNICACIÓN CON EL BANCO, POR FAVOR INTENTE NUEVAMENTE EN UNOS MINUTOS',4000);
      }
      // console.log(error);
    })
  }

  onKeyPin(pinForm){  
    let pin = String(pinForm.value);
    let regexp = new RegExp(/^[0-9]{1,4}$/);
    let valid_pin = regexp.test(pin) ? pin : pin.slice(0, 4);
    this.f.pin.setValue(valid_pin);
  }
}
