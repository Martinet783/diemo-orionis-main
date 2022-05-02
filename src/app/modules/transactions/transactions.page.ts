import { Component, OnInit } from '@angular/core';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';
import { faFilter, faListUl, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/core/services/user/user.service';
import { Transactions } from 'src/app/core/models/transactions';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {

  faFileAlt = faFileAlt;
  faFilter = faFilter;
  faListUl = faListUl;
  faSpinner = faSpinner;
  transaction : Transactions;
  transactions = Array<Transactions>();
  showDetails : boolean = false;
  loadingTransactions : boolean = false;
  filter : boolean = false;
  spinner : boolean = false;
  faTimes = faTimes;
  nroTransactions: any
  entradas = 0 ;
  salidas = 0;
  ok : string = "OK";
  cancel : string = "CANCELAR"
  now : string;
  now2 : string;

  startDate : any ;
  endDate : any;
  type: string;

  coin : string;
  
  constructor(private userService : UserService,
              private toastService : ToastService,
    ) { }

  ngOnInit() {
    this.getWalletMoneyTransactions();
    this.getCoin();
    let date = new Date();
    let month = (date.getMonth() <= 9) ? "0"+(date.getMonth()+1) : date.getMonth()+1; 
    let day = (date.getDate() <= 9) ? "0"+(date.getDate()) : date.getDate(); 
    this.now = String(date.getFullYear()+"-"+month+"-"+day);
    console.log(this.now);
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

  detailsTransaction(item : Transactions){
    this.showDetails = true;
    this.transaction = item;
  }

  outputDetailsTransaction($event){
    this.showDetails = false;
  }

  resetFilter(filter : boolean){
    this.filter=!filter;

    if(!filter){
      this.startDate = null;
      this.endDate = null;
      this.type = "";
    }
  }

  getWalletMoneyTransactions(req : any = {"all" : true}, spinner : boolean = true){
    
    this.loadingTransactions = spinner;
    this.spinner = true;
    this.salidas = 0;
    this.entradas = 0;

    this.userService.getWalletMoneyTransactions(req).subscribe(data => {
      this.loadingTransactions = false;
      this.spinner = false;

      if(data.data){
        this.transactions = data.data;
        this.nroTransactions = data.data.length
        
        data.data.forEach(element => {
          if(element.debe == 2){
            this.salidas = this.salidas + element.amount
          }else{
            this.entradas = this.entradas + element.amount
          }
        });

      }
    }, error => {
      this.loadingTransactions = false;
      this.spinner = false;
    })
  }

  doRefresh($event){
    setTimeout(() => {
      $event.target.complete();
      this.getWalletMoneyTransactions({all : true}, false);
    }, 2000);
  }

  customActionSheetOptions: any = {
    header: 'SELECCIONA UN TIPO DE OPERACIÓN',
    translucent: true
  };

  filterTransaction(){
    let filter : any = {};
    if(this.startDate){
      filter.startDate = new Date(this.startDate).getTime() / 1000;
    }
    if(this.endDate){
      filter.endDate = new Date(this.endDate).getTime() / 1000;
    }
    if(this.type){
      filter.type = this.type;
    }
    filter.all = true;


    if(this.startDate > this.endDate || this.endDate < this.startDate){
      let msj : string;
      msj = (this.startDate > this.endDate) ? "La fecha inicial debe ser menor o igual a la fecha final" : "La fecha final debe ser mayor a la fecha inicial"; 
      this.toastService.showToast("danger", "ERROR", msj, 4000);
    }else{
      this.getWalletMoneyTransactions(filter, false);
    }

  }

  transform(num : number ){
    let number = num.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return number
  }

}
