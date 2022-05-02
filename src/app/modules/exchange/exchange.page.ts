import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faUniversity } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/core/services/user/user.service';
import { BalanceComponent } from '../balance/balance.component';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { sha256 } from 'js-sha256';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.page.html',
  styleUrls: ['./exchange.page.scss'],
})
export class ExchangePage implements OnInit {

  @ViewChild(BalanceComponent) balanceComponent : BalanceComponent;

  exchangeForm : FormGroup;
  transactions : Array<any>;
  loading : boolean;
  divisa : string;
  simbolo : string;
  fontSize : string;
  pin : string;
  balance : number;
  exchange : number;
  isSubmitted : boolean;
  dolarToday : number;
  faUniversity = faUniversity;
  faSpinner = faSpinner;

  constructor(private userService : UserService,
              private toastr : ToastService,
              private router : Router,
              private formBuilder : FormBuilder) { }

  ngOnInit() {
    
    this.exchangeForm = this.formBuilder.group({
      usdAmount : ['', [Validators.required, Validators.pattern('[0-9]*?.*?[0-9]*')]],
      pin : ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]{4}$')]],
    })
    this.getwalletMoneyBalances();
    this.walletBankExchangeRate();
    this.divisa = localStorage.getItem('divisa');
  }

  get f(){ return this.exchangeForm.controls; }

  getwalletMoneyBalances(){
    this.userService.getWalletMoneyBalances().subscribe(data => {
      if(data.data){
        this.balance = data.data.diemoBalance;
        localStorage.setItem('balance', String(this.balance));

        this.divisa = localStorage.getItem('divisa');
        if (this.divisa == "usd"){
          this.simbolo = "$";
          this.fontSize = "1.5rem";
        }
        else if (this.divisa == "bs"){
          this.simbolo = "Bs.";
          this.fontSize = "1rem";
       }
        else if (this.divisa == "eur"){
          this.simbolo = "€";
          this.fontSize = "1.5rem";
       }  

      }
    }, error => {
      console.log(error);
    })
  }

  transform(num : number ){
    if(num){
      let number = num.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
      return number
    }
  }

  onKeyPin(pinForm){  
    let pin = String(pinForm.value);
    let regexp = new RegExp(/^[0-9]{1,4}$/);
    let valid_pin = regexp.test(pin) ? pin : pin.slice(0, 4);
    this.f.pin.setValue(valid_pin);
  }

  changeAmount(amount : number){
    console.log(amount);
    this.exchange = amount * this.dolarToday;
  }

  bankLiquidar(data : any){
    this.loading = true;
    let req = {...data};
    req.pin = sha256(req.pin);
    console.log(req);
    this.userService.bankLiquidar(req).subscribe(data => {
      console.log(data);
      this.loading = false;
      if(data.data){
        this.toastr.showToast('banplus-light', "ÉXITO", data.data, 4000);
        this.router.navigateByUrl('home');
      }
    }, error => {
      this.loading = false;
      if(error.error){
        this.toastr.showToast('danger', "ERROR", error.error.msg, 4000);
      }
    })
  }

  submitForm(){
    this.isSubmitted = true;
    if(this.exchangeForm.invalid){return;}

    let req = this.exchangeForm.value;
    req.isRecharge = false;

    this.bankLiquidar(req);
  }
  
  walletBankExchangeRate(){
    this.userService.walletBankExchangeRate().subscribe(data => {
      console.log(data);
      if(data.data){
        this.dolarToday = data.data;
      }
    }, error => {
      console.log(error);
    })
  }
}
