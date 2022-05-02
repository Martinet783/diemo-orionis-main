import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user/user.service';
import { faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ModalController } from '@ionic/angular';
import { PosPaymentComponent } from 'src/app/shared/pos-payment/pos-payment.component';
import { Order } from 'src/app/core/models/order';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {

  faEye = faEye;
  faSpinner = faSpinner;
  loading : boolean = false;
  orders = new Array<Order>();

  constructor(private userService : UserService, 
              public modalController : ModalController) { }

  ngOnInit() {
    this.posMoneyMyOrders();
    //this.showPayment();
  }

  posMoneyMyOrders(req : any = {"flag":4, "last3": false}){
    this.loading = true;
    this.userService.posMoneyMyOrders(req).subscribe(data => {
      // console.log(data);
      this.loading = false;
      if(data.data){
        this.orders = data.data;
      }
    }, error =>{
      this.loading = false;
      // console.log(error);
    })
  }

 async showPayment(payment : Order){
   
    const modal = await this.modalController.create({
      component: PosPaymentComponent,
      swipeToClose: true,
      backdropDismiss: true,
      componentProps : { 'payment' : payment}
    })

    modal.onWillDismiss().then(data => {
      this.posMoneyMyOrders();
    }).catch(error => {})

    return await modal.present();
  }

  doRefresh(event) {
    // console.log('Begin async operation');
    setTimeout(() => {
      // console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
