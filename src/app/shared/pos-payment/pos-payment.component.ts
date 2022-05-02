import { Component, OnInit, Input, AfterContentInit, Pipe, PipeTransform } from '@angular/core';
import { Payment } from 'src/app/core/models/payment';
import { ModalController } from '@ionic/angular';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/core/services/user/user.service';
import { HomeRefreshService } from 'src/app/core/services/home-refresh/home-refresh.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { sha256 } from 'js-sha256';
import { FormControl, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
 
@Component({
  selector: 'app-pos-payment',
  templateUrl: './pos-payment.component.html',
  styleUrls: ['./pos-payment.component.scss'],
})

export class PosPaymentComponent implements OnInit, AfterContentInit {
  
  @Input() payment : Payment;
  interval = interval(1000);
  takeFour = this.interval.pipe();
  pin : FormControl;
  pin2 : string;
  loading : boolean;
  showAcep = true
  showRecha = true
  faTimes = faTimes;
  faSpinner = faSpinner;
  showPin : boolean = false;
  order : boolean = false;
  count : number;
  expired : boolean = false;

  constructor(public modalController: ModalController,
              private homeRefreshService : HomeRefreshService,
              public userService : UserService,
              private toastService : ToastService) { }

  ngOnInit() {
    this.pin= new FormControl('', 
      [ Validators.required, 
        Validators.maxLength(4), 
        Validators.minLength(4),
        Validators.pattern('^[0-9]{4}$')])
  }

  ngAfterContentInit(): void {
    console.log(this.payment);
    this.order = (this.payment.type === "payment_order") ? true : false;
    if(this.payment.type === "pos_pay" || this.payment.type === "pago_pos"){
      this.moneyTransactions(this.payment);
    }
    if(this.payment.type === "payment_order"){
      this.parseDate(this.payment);
    }
    
  }

  dismiss(req){
    this.modalController.dismiss(req);
  }

  confirmPayment(confirmation : boolean){
    if(this.pin!= null && this.pin2 != '' || !confirmation){
      this.loading = true;

      if(confirmation == true){
        this.showRecha =  false
      }else{
        this.showAcep = false
      }

      let req = { traceNumber : this.payment.traceNumber, 
                  confirmation: confirmation, 
                  pin: sha256(String(this.pin2)) }
      this.userService.confirmPayment(req).subscribe(data => {
        this.loading = false;
        this.homeRefreshService.setRefresh(true);
        this.toastService.showToast('banplus-neutral', 'IMPORTANTE', data.data)
        this.dismiss(null);
      }, error => {
        this.loading = false;
        if(error.error.code){
          this.toastService.showToast('danger', 'ERROR', error.error.msg)
        }
      })
    }else{
      this.toastService.showToast('banplus-neutral', 'IMPORTANTE', 'EL PIN NO PUEDE ESTAR VACIO')
    }
  }

  onKeyPin(pin){  
    let regexp = new RegExp(/^[0-9]{4}$/);
    let valid_pin = regexp.test(pin) ? pin : pin.slice(0, 4);
    if(regexp.test(pin)){ this.pin = valid_pin;}    
  }

  confirmOrder(confirmation : boolean){
    if(this.pin!= null && this.pin2 != '' || !confirmation){
      this.loading = true;

      if(confirmation == true){
        this.showRecha =  false
      }else{
        this.showAcep = false
      }

      let req = (confirmation) ? 
        { traceNumber : this.payment.traceNumber, 
          confirmation: confirmation, 
          pin: sha256(this.pin2) } : { traceNumber : this.payment.traceNumber, 
                                          confirmation: confirmation };
      this.userService.confirmOrder(req).subscribe(data => {
        this.loading = false;
        this.homeRefreshService.setRefresh(true);
        this.toastService.showToast('banplus-neutral', 'IMPORTANTE', data.data)
        this.dismiss(null);
      }, error => {
        this.loading = false;
        if(error.error.code){
          this.toastService.showToast('danger', 'ERROR', error.error.msg)
          this.showRecha = true
          this.showAcep = true
        }
      })
    }else{
      this.toastService.showToast('banplus-neutral', 'IMPORTANTE', 'EL PIN NO PUEDE ESTAR VACIO')
    }
  }

  moneyTransactions(payment : Payment){
    this.userService.moneyTransactions(payment.reference).subscribe(data => {
      console.log(data);
      if(data.data){
        this.payment = data.data;
        this.parseDate(data.data); 
      }
    }, error => {
      console.log(error);
    })
  }

  getDifferenceInSeconds(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return (diffInMs / 1000);
  }

  parseDate(payment : Payment){
    let expires_at = new Date(payment.expires_at*1000);
    let now = new Date();
    console.log("fecha de expiración",expires_at);
    console.log("fecha de ahora ramoncito maldito",now) ;
    if(!this.count && (now < expires_at)){
      this.count = Number(this.getDifferenceInSeconds(now, expires_at).toString().split(".")[0]);
    }else{
      this.expired = true;
      if(payment.operationType == 10){
        this.confirmOrder(false)
      } 
      if(payment.operationType == 5){
        this.confirmPayment(false)
      }
    }
    
    this.interval.subscribe(data => {
      this.expired = (now > expires_at) ? true : false;
      if(this.count == 0){
        if(payment.operationType == 10){
          this.confirmOrder(false)
        } 
        if(payment.operationType == 5){
          this.confirmPayment(false)
        } 
      };
      this.count = (this.count > 0) ? this.count-1 : null;
      
    })
  }

  transform(num : number ){
    let number = num.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return number
  }

}
