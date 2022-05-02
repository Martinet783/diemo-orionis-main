import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Bank } from 'src/app/core/models/bank';
import { UserService } from 'src/app/core/services/user/user.service';
import { DatePipe } from '@angular/common';
import { Recharge } from 'src/app/core/models/recharge';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Router } from '@angular/router';
import { HomeRefreshService } from 'src/app/core/services/home-refresh/home-refresh.service';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-bank-form',
  templateUrl: './bank-form.component.html',
  styleUrls: ['./bank-form.component.scss'],
  providers: [DatePipe]
})

export class BankFormComponent implements OnInit {

  @Input() ValidationType: number;
  bankForm: FormGroup;
  submitted : boolean = false;
  listBank = Array<Bank>();
  options : string = '0';
  loading : boolean = false;
  user : User;

  constructor(
    private formBuilder: FormBuilder,
    private modalController : ModalController,
    private userService : UserService,
    private datePipe: DatePipe,
    private toastService: ToastService,
    private router : Router,
    private homeRefreshService : HomeRefreshService
  ){ }

  ngOnInit() {
    
    this.bankForm = this.formBuilder.group({
      madeBy: ['', [ Validators.required]],
      idDocumentType : [''],
      document : [''],
      operator : [''],
      subPhoneNo : [''],
      referenceNumber: ['', [ Validators.required, Validators.pattern('[0-9]*')]],
      bankCode: ['',[ Validators.required ]],
      amount: ['', [ Validators.required, Validators.pattern('[0-9]*?.*?[0-9]*')]],
      date: ['', [ Validators.required]]
    });

    this.getP2CBanks();

    this.user = JSON.parse(localStorage.getItem('user'));

    this.bankForm.get('madeBy').valueChanges.subscribe(value => {
      this.options = (value) ? value : null;
      if(value==='1') {
        this.bankForm.get('idDocumentType').setValidators([Validators.required]);
        this.bankForm.get('document').setValidators([Validators.required, Validators.pattern('[0-9]*')]);
        this.bankForm.get('operator').setValidators([Validators.required]);
        this.bankForm.get('subPhoneNo').setValidators([Validators.required, Validators.minLength(7), Validators.maxLength(7), Validators.pattern('[0-9]*')]);
      }
      if (value === '0'){
        this.bankForm.get('idDocumentType').setValidators(null);
        this.bankForm.get('document').setValidators(null);
        this.bankForm.get('operator').setValidators(null);
        this.bankForm.get('subPhoneNo').setValidators(null);
      }
      this.bankForm.get('idDocumentType').updateValueAndValidity();
      this.bankForm.get('document').updateValueAndValidity();
      this.bankForm.get('operator').updateValueAndValidity();
      this.bankForm.get('subPhoneNo').updateValueAndValidity();
     
    });
  }

  get f(){ return this.bankForm.controls}

  onKeyPhone(subPhoneNoForm){
    let subPhoneNo = String(subPhoneNoForm.value);
    let regexp = new RegExp(/^[0-9]{1,7}$/);
    let valid_subPhoneNo = regexp.test(subPhoneNo) ? subPhoneNo : subPhoneNo.slice(0, 7);
    this.f.subPhoneNo.setValue(valid_subPhoneNo);
  }
  
  onSubmit(){
    this.submitted = true;
    if(this.bankForm.invalid){return;}

    let form = this.bankForm.value;
    let recharge = new Recharge();
    recharge.Date = this.datePipe.transform(form.date, 'yyy-MM-dd');
    recharge.ValidationType = this.ValidationType;

    if (this.bankForm.get('madeBy').value === '1'){

      recharge.PhoneNumber = '58' + form.operator + form.subPhoneNo;
      recharge.DocumentType = form.idDocumentType;
      recharge.Document = String(form.document);

    } else {
      if ( this.user.idDocumentType === 0){ recharge.DocumentType = 'V';}
      if ( this.user.idDocumentType === 1){ recharge.DocumentType = 'E';}
      if ( this.user.idDocumentType === 2){ recharge.DocumentType = 'P';}
      recharge.PhoneNumber = String(this.user['subPhoneNo']);
      recharge.Document = String(this.user['idUser']);
    }
    
    recharge.setForm(form);
    this.walletBankValidateReference(recharge);
  }

  close(){
    this.modalController.dismiss();
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

  walletBankValidateReference(req : any){
    this.loading = true;
    this.userService.walletBankValidateReference(req).subscribe(data => {
      //console.log(data);
      this.loading = false;
      if(data){
        this.bankForm.reset()
        this.submitted = false;
        this.toastService.showToast('success', 'ÉXITO', 'RECARGA REALIZADA.');
        this.router.navigateByUrl('/home');
        this.homeRefreshService.setRefresh(true);
        this.modalController.dismiss();
      }
    }, error => {
      // console.log(error);
      this.loading = false;
      if(error.error?.code){
        this.toastService.showToast('danger', 'ERROR', error.error.msg);
      }
      if(error?.name == "TimeoutError"){
        this.toastService.showToast('danger', 'ERROR', 'HUBO UN PROBLEMA DE COMUNICACIÓN CON EL BANCO, POR FAVOR INTENTE NUEVAMENTE EN UNOS MINUTOS',4000);
      }
    })

  }
}
