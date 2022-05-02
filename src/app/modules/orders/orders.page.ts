import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/core/services/user/user.service';
import { faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ModalController } from '@ionic/angular';
import { PosPaymentComponent } from 'src/app/shared/pos-payment/pos-payment.component';
import { Order } from 'src/app/core/models/order';
import { interval  } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  faEye = faEye;
  faSpinner = faSpinner;
  loading : boolean = false;
  orders = new Array<Order>();

  constructor(private userService : UserService, 
              public modalController : ModalController) { }

  ngOnInit() {
    this.posMoneyMyOrders();
  }

  posMoneyMyOrders(req : any = {"flag":4, "last3": true}){
    this.loading = true;
    this.userService.posMoneyMyOrders(req).subscribe(data => {
      let now = new Date();
      console.log(now, data);
      this.loading = false;
      if(data.data){
        this.orders = data.data;
      }
    }, error =>{
      this.loading = false;
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
      console.log("onWillDismiss",data);
      this.posMoneyMyOrders();
    }).catch(error => {})

    return await modal.present();
  }

  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
