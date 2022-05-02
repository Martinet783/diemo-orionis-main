import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { faHome, faUserCircle, faWallet, faExchangeAlt, faWifi, faMoneyBillWave, faPlane, faSpinner  } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { User } from 'src/app/core/models/user';
import { Transactions } from 'src/app/core/models/transactions';
import { HomeRefreshService } from 'src/app/core/services/home-refresh/home-refresh.service';
import { AlertController, IonRouterOutlet } from '@ionic/angular';
import { QrModalComponent } from './qr-modal/qr-modal.component';
import { ModalController } from '@ionic/angular';
import { OrdersPage } from '../orders/orders.page';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild(OrdersPage) ordersPage : OrdersPage;
  @ViewChild('slides', { static: true }) slides: IonSlides;
  faHome = faHome;  
  faUser = faUserCircle;
  faWallet = faWallet;
  faWifi = faWifi;
  faExchangeAlt = faExchangeAlt;
  faFileAlt = faFileAlt;
  faMoneyBill = faMoneyBillWave;
  faPlane = faPlane;
  faSpinner = faSpinner;
  transaction : Transactions;
  showDetails : boolean = false;
  finger : boolean = false;

  user = new User();
  loadingTransactions : boolean = false;

  slideOpts = {
    slidesPerView: 2.2
  };

  transactions : Array<Transactions>;

  divisa : string = "bs";

  simboloMoneda : string = "Bs."

  constructor(private router : Router,
              private alertService : AlertService,
              private homeRefreshService : HomeRefreshService,
              private userService : UserService,
              private faio : FingerprintAIO,
              private nativeStorage : NativeStorage,
              private routerOutlet: IonRouterOutlet,
              private modalController : ModalController,
              public alertController: AlertController) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getWalletMoneyTransactions();
    // this.presentModal();
    this.alertService.showObservable.subscribe(data => {
      if(data){
        localStorage.removeItem('user');
        localStorage.removeItem('Authorization');
        localStorage.removeItem('X-Refresh');
        this.router.navigateByUrl('auth/signin');
        this.alertService.closeAlert();
      }
    })

    this.homeRefreshService.observableHome.subscribe(data => {
      if(data){
          this.getWalletMoneyTransactions();
      }
    })

    /** VERIFY FINGERPRINT */
    this.faio.isAvailable().then( data => {
      this.finger = true
      this.nativeStorage.getItem('faio')
    //   this.faio.show({
    //     title: 'Autenticación', // (Android Only)
    //     description: 'Por favor verifica tu identidad', //ios
    //     fallbackButtonTitle: 'Use Pin', //ios
    //     disableBackup:true // android optional
    // })
      .then(
        data => {
          if(data){
            this.finger = false
          }
        },
        error => console.error(error));
    }, error => console.log(error))

    this.divisa = localStorage.getItem('divisa');

    if(!this.divisa){
      localStorage.setItem('divisa', this.divisa = 'bs');
    }

    document.getElementById('bs').style.transform = "scale(1.2)";
    document.getElementById('bs').style.transition = "transform 0.25s ease";

    this.verifyAffiliation()
  }

  getWalletMoneyTransactions(){
    this.loadingTransactions = true;
    this.userService.getWalletMoneyTransactions({"all" : false}).subscribe(data => {
      this.loadingTransactions = false;
      if(data.data){
        this.transactions = data.data;
        if (this.divisa == "usd"){
          this.simboloMoneda = "$";
        }
        else if (this.divisa == "bs"){
          this.simboloMoneda = "Bs.";
        }
        else if (this.divisa == "eur"){
          this.simboloMoneda = "€";
        }
      }
    }, error => {
      this.loadingTransactions = false;
    })
  }


  registerFirgenprint(){
    this.faio.registerBiometricSecret({secret : this.user.finger_key}).then(data => {
      /** SAVE USER FAIO (FINGERPRINT) IN NATIVE STORAGE */
      this.nativeStorage.setItem('faio', {user: this.user.finger_key})
        .then( () =>  this.finger = false,
          error => console.error('Error storing item', error)
      );
    }, error => {
      console.log(error);
      this.registerFirgenprint();
    })
  }

  doRefresh($event){
    setTimeout(() => {
      $event.target.complete();
      this.getWalletMoneyTransactions();
      this.ordersPage.posMoneyMyOrders();
      this.homeRefreshService.setRefresh(true);
    }, 2000);
  }

  goTo(path : string){ this.router.navigateByUrl(path); }

  logout(){
    this.alertService.presentAlertConfirm("Cerrar sesión", "¿Está seguro que desea cerrar la sesión?");
  }

  detailsTransaction(item : Transactions){
    this.showDetails = true;
    this.transaction = item;
  }

  outputDetailsTransaction($event){
    this.showDetails = false;
  }

  async presentModal(){
    const modal = await this.modalController.create({
      component: QrModalComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }


  async presentModal2() {
    const modal = await this.modalController.create({
      component: QrModalComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  changeDivisa(moneda : string){
    let button = document.getElementById(moneda);
    button.style.transform = "scale(1.2)";
    button.style.transition = "transform 0.25s ease";
    
    if (moneda != 'usd') document.getElementById('usd').style.transform = "scale(1)";
    if (moneda != 'bs') document.getElementById('bs').style.transform = "scale(1)";
    if (moneda != 'eur') document.getElementById('eur').style.transform = "scale(1)";
    localStorage.setItem('divisa', moneda);
    this.divisa = moneda;
    this.homeRefreshService.setRefresh(true);

  }

  transform(num : number ){
    let number = num.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return number
  }

  async verifyAffiliation(){
    var msj = ""
    var status = -1
    if(this.user.hasOwnProperty('affiliation')){
      status = this.user['affiliation'][0]['Status']
    }

    switch(status){
      case -1:
        msj = "No está preafiliado a Banplus, ¿Deseas hacerlo ahora?"
        break;
      case 0:
        msj = "Usted esta preafiliado a Banplus. Debe dirigirse a https://banplus.com para culminar con su afiliación"
        break;
      default:
        return
    }

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'AFILIACIÓN',
      subHeader: '',
      message: msj,
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'ACEPTAR',
          handler: () => {
            if(status == -1){
              this.goTo('profile')
            }
            
          }
        }
      ]
    });

    await alert.present();
  }


}
