import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Transactions } from 'src/app/core/models/transactions';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modal-detail',
  templateUrl: './modal-detail.component.html',
  styleUrls: ['./modal-detail.component.scss'],
})
export class ModalDetailComponent implements OnInit, AfterViewInit {

  @Input() transactions: Transactions;
  transactions2: Transactions;
  faTimes = faTimes;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    // this.transactions2 = {
    //   amount: 85,
    //   balance_after: 77509,
    //   balance_before: 77594,
    //   bankReference: "220371",
    //   created_at: 1606245748.337819,
    //   currency: "1",
    //   debe: 2,
    //   destiny: "584129089017",
    //   documento: "21284308",
    //   operationType: 3,
    //   origin: "584242296185",
    //   status: 1,
    //   traceNumber: "3991136782499056",
    //   type: "Withdraw"
    // }
    // console.log(this.transactions2);
  }

  ngAfterViewInit(){
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  transform(num : number ){
    let number = num.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return number
  }


}
