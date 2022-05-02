import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user/user.service';
import { HomeRefreshService } from 'src/app/core/services/home-refresh/home-refresh.service';

@Component({
  selector: 'balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent implements OnInit {

  @Input() amount_out : number;
  balance_text = {};
  balance : number = 0;
  simboloMoneda : string = "";
  fontSize : string = "1rem";

  constructor(private userService : UserService,
              private homeRefreshService : HomeRefreshService) { }

  ngOnInit() {
    console.log("balance")
    this.getwalletMoneyBalances();
    this.homeRefreshService.observableHome.subscribe(data => {
      if(data){
          this.getwalletMoneyBalances();
      }
    })
  }

  ngAfterViewInit(): void {
    console.log(this.amount_out)
    if(this.amount_out){
      this.balance = (this.balance && this.balance > this.amount_out) ? (this.balance - this.amount_out) : this.balance;
    }
  }

  getwalletMoneyBalances(){
    this.userService.getWalletMoneyBalances().subscribe(data => {
      if(data.data){
        this.balance = data.data.diemoBalance;
        localStorage.setItem('balance', String(this.balance));

        let divisa = localStorage.getItem('divisa')
        if (divisa == "usd"){
          this.simboloMoneda = "$";
          this.fontSize = "1.5rem";
        }
        else if (divisa == "bs"){
          this.simboloMoneda = "Bs.";
          this.fontSize = "1rem";
       }
        else if (divisa == "eur"){
          this.simboloMoneda = "€";
          this.fontSize = "1.5rem";
       }  

      }
      setTimeout(()=>{this.resizeBalance();}, 100)
      
    }, error => {
      console.log(error);
    })
  }

  resizeBalance(){
    if(this.balance > 10000 && this.balance <= 99999){
      this.balance_text = {"font-size": "1.4rem !important"}
    }else if(this.balance >= 100000 && this.balance <= 999999){
      this.balance_text = {"font-size": "1.3rem !important"}
    }else if(this.balance >= 1000000 && this.balance <= 10000000){
      this.balance_text = {"font-size": "1.3rem !important"}
    }
    else if(this.balance >= 10000001 && this.balance <= 1000000000){
      this.balance_text = {"font-size": "1.2rem !important"}
    }
  }
  
  transform(num : number ){
    let number = num.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return number
  }

}
