import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Platform, AlertController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
// import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { TokenFirebaseService } from './core/services/token-firebase/token-firebase.service';
import { HomeRefreshService } from './core/services/home-refresh/home-refresh.service';
import { Payment } from './core/models/payment';
import { PosPaymentComponent } from './shared/pos-payment/pos-payment.component';
import { ToastService } from './core/services/toast/toast.service';
import { ModalDetailComponent } from './modules/detail-transaction/modal-detail/modal-detail.component';
import { Transactions } from './core/models/transactions';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';

const { PushNotifications,  Modals } = Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  posPayment : boolean;
  payment : Payment;
  showExit: boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    // private firebase : FirebaseX,
    private tokenFirebase : TokenFirebaseService,
    private homeRefreshService : HomeRefreshService,
    private userService : UserService,
    private toastService : ToastService,
    private router : Router,
    public alertController: AlertController,
    private network : Network,
    private modalController : ModalController,
    private localNotifications : LocalNotifications
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.
      // this.statusBar.overlaysWebView(true);
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      console.log = () => {};
      // this.localNotification();
      this.registerPush();
    });
  }

  async localNotification(){
    if (this.platform.is('android')) {
      this.localNotifications.schedule({
        id: 1,
        text: 'Single ILocalNotification',
        data: { secret: 'key' }
      });
    }
  }


  ngOnInit() {
      this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {

        if (this.router.url == '/home') {
          this.showExitConfirm();
        } else {
          processNextHandler();
        }
      });

      this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
      });

      this.network.onConnect().subscribe((data) => {
        console.log('network was connected :-)');
        //console.log(data);
      });
  }



  private registerPush() {
    PushNotifications.requestPermission().then((permission) => {
      if (permission.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
      }
    });


    PushNotifications.addListener('registration', (token: PushNotificationToken) => {
        this.tokenFirebase.setToken(token.value);
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
        this.notificationAction(notification);
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed', async (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        this.notificationAction(notification.notification);
      }
    );
  }


  notificationAction(notification : any){
    let ndata = notification.data;

    console.log(ndata);

    if(ndata.type == "transfer_des" || ndata.type == "transfer_ori"){
      this.homeRefreshService.setRefresh(true);
    }
    if(ndata.transaction_id && ndata.type == "cobro"){
      this.moneyTransactions(ndata.transaction_id);
    }
    if(ndata.transaction_id && ndata.type == "payment_order"){
      this.moneyTransactions(ndata.transaction_id);
    }
  }

  moneyTransactions(req : any){
    this.userService.moneyTransactions(req).subscribe(data => {
      this.presentModal(data.data);
      this.posPayment = true;

      if(data.data){
        this.payment = data.data;
        this.posPayment = true;
      }
    }, error => {
      console.log(error);
    })
  }

  showExitConfirm() {
    if(!this.showExit){
      this.showExit = true;
      this.alertController.create({
        header: 'Cerrar Wallet Plus',
        message: '¿Estás seguro que quieres cerrar la aplicación?',
        backdropDismiss: false,
        buttons: [{
          text: 'NO',
          role: 'cancel',
          handler: () => {
            this.showExit = false;
          }
        }, {
          text: 'CERRAR',
          handler: () => {
            this.showExit = false;
            navigator['app'].exitApp();
          }
        }]
      })
        .then(alert => {
          alert.present();
        });
    }

  }

  async presentModal(payment : Payment) {
    console.log("presentModal",payment);
    const modal = await this.modalController.create({
      component: PosPaymentComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      backdropDismiss: true,
      componentProps : { 'payment' : payment}
    });


    modal.onWillDismiss().then(data => {
      console.log(" modal.onWillDismiss()", data);
      if(data.data.traceNumber){
        this.confirmationPayment(data.data);
      }
    });

    return await modal.present();
  }

  async presentModalTransfer(transactions : Transactions) {
    const modal = await this.modalController.create({
      component: ModalDetailComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps : { 'transactions': transactions }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log("presentModal", data);
  }

  confirmationPayment(req : any){
    console.log(req);
    let payment = { traceNumber : req.traceNumber, confirmation: false }
    this.userService.confirmPayment(payment).subscribe(data => {
      console.log(data);
      this.toastService.showToast('diemo-info', 'INFO', 'LA TRANSACCIÓN HA SIDO RECHAZADA');
      
    }, error =>{
      console.log(error);
    })
  }
}
