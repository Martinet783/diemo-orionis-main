import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/core/services/user/user.service';
import { Transactions } from 'src/app/core/models/transactions';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {

  @Input() transactions = Array<Transactions>();
  faFileAlt = faFileAlt;
  faSpinner = faSpinner;
  loading : boolean;

  transaction: Transactions;
  showDetails = false;

  coin : string;

  constructor(private userService : UserService,
              private toastService : ToastService,
              private device: Device) { }

  ngOnInit() {
    this.getWalletOfflineTransactions();
    this.getCoin();
  }

  getCoin(){
    let divisa = localStorage.getItem('divisa');
    if(divisa == "bs"){
      this.coin = 'Bs.'
    }
    if(divisa == "usd"){
      this.coin = '$'
    }
    if(divisa == "eur"){
      this.coin = '€'
    }
  }

  getWalletOfflineTransactions(){
    this.loading = true;
    var req = {"device_id":this.device.uuid}
    this.userService.getWalletOfflineTransactions(req).subscribe(data =>{
      this.loading = false;
      if(data.data){
        this.transactions = data.data;
      }
    }, error =>{
      if(error.error){
        this.toastService.showToast('danger', 'ERROR', error.error.msg);
      }
      this.loading = false;
    })
  }

  detailsTransaction(item : Transactions){
    this.showDetails = true;
    this.transaction = item;
  }

  outputDetailsTransaction($event){
    this.showDetails = false;
  }

  transform(num : number ){
    let number = num.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return number
  }


}
