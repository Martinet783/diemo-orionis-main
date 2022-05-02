import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { sha256 } from 'js-sha256';
import { Bank } from 'src/app/core/models/bank';
import { Withdraw } from 'src/app/core/models/withdraw';
import { HomeRefreshService } from 'src/app/core/services/home-refresh/home-refresh.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-out-banplus',
  templateUrl: './out-banplus.component.html',
  styleUrls: ['./out-banplus.component.scss'],
})
export class OutBanplusComponent implements OnInit {

  transferForm : FormGroup;
  divisa : string;
  loading2 : boolean = false;
  isSubmitted : boolean = false;
  listBank = Array<Bank>();


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
      operator:['',Validators.required],
      subNo: ['', [Validators.required, Validators.maxLength(7), Validators.minLength(7), Validators.pattern('[0-9]*')]],
      idDocumentType:['',Validators.required],
      bank:['',Validators.required],
      document:['',[ Validators.required, Validators.pattern('[0-9]*')]]
    })
    this.getP2CBanks();
    this.divisa = localStorage.getItem('divisa');
  }

  get f() { return this.transferForm.controls; }

  onKeyPhone(subNoForm){
    let subNo = String(subNoForm.value);
    let regexp = new RegExp(/^[0-9]{1,7}$/);
    let valid_subNo = regexp.test(subNo) ? subNo : subNo.slice(0, 7);
    this.f.subNo.setValue(valid_subNo);
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

  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'CONFIRMACIÓN',
      subHeader: '',
      message: '¿Está seguro que desea realizar el pago móvil a los datos ingresados?',
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
            var withdraw = {
              "phone": '0'+form.operator+form.subNo,
              "document":form.document,
              "bank":form.bank,
              "amount":form.amount,
              "pin": sha256(form.pin),
              "type": form.idDocumentType
            }
            this.walletMoneyWithdraw(withdraw);
          }
        }
      ]
    });

    await alert.present();
  }

  walletMoneyWithdraw(req : any){
    this.loading2 = true;
    console.log(req);
    this.userService.walletMoneyWithdrawP2C(req).subscribe(data => {
      this.loading2 = false;
      // console.log(data);
      if(data){
        this.transferForm.reset()
        this.isSubmitted = false;
        this.toastService.showToast('success', 'ÉXITO', 'RETIRO REALIZADO.');
        this.router.navigateByUrl('/home');
        this.homeRefreshService.setRefresh(true);
      }
    }, error => {
      this.loading2 = false;
      if(error.error?.code){
        this.toastService.showToast('danger', 'ERROR', error.error.msg);
      }
      if(error?.name == "TimeoutError"){
        this.toastService.showToast('danger', 'ERROR', 'HUBO UN PROBLEMA DE COMUNICACIÓN CON EL BANCO, POR FAVOR INTENTE NUEVAMENTE EN UNOS MINUTOS',4000);
      }
      // console.log(error);
    })
  }

  getP2CBanks(){
    this.userService.getP2CBanks().subscribe(data => {

      if(data){
        this.listBank = data;
      }
    }, error => {
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
