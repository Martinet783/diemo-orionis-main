import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/services/user/user.service';
import { faMoneyBill, faWallet, faTimes, faQrcode, faSyncAlt, faUser, faCog, faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FormOperationsComponent } from './form-operations/form-operations.component';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { PayOffline } from 'src/app/core/models/pay_offline';
import { ModalController, Platform, AlertController } from '@ionic/angular';
import { DownloadInfoComponent } from './download-info/download-info.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { Router } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
import { empty } from 'rxjs';
import { HomeRefreshService } from 'src/app/core/services/home-refresh/home-refresh.service';

@Component({
  selector: 'app-offine',
  templateUrl: './offine.page.html',
  styleUrls: ['./offine.page.scss'],
})
export class OffinePage implements OnInit {

  @ViewChild(TransactionsComponent) transactionsComponent: TransactionsComponent;
  faMoneyBill = faMoneyBill;
  faWallet = faWallet;
  faQrcode = faQrcode;
  faTimes = faTimes;
  faSyncAlt = faSyncAlt;
  faUser = faUser;
  faCog = faCog;
  faDownload = faDownload;
  faSpinner = faSpinner;
  type_operation : number = 1;
  balance : number;
  loading : boolean = false;
  showForm : boolean = false;
  loadingb : boolean = false;
  sync : boolean = false;
  offliePay = Array<PayOffline>();
  listTransactions = Array<any>();
  walletInfo : any;
  showExit : boolean = false;

  constructor(private userService : UserService,
    private modalController : ModalController,
    private router : Router,
    private platform : Platform,
    private alertController : AlertController,
    private device: Device,
    private homeRefreshService : HomeRefreshService,
    private toastService : ToastService) { }

  ngOnInit() {
    this.walletOfflineBalance()

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {

      if (this.router.url == '/offine') {
        this.showExitConfirm();
      } else {
        processNextHandler();
      }
    });

  }

  walletOfflineBalance(){
    this.loadingb = true;
    var req = {"device_id": this.device.uuid}
    this.userService.getWalletOfflineBalance(req).subscribe(data => {
      this.loadingb = false;
      if(data.data){
        this.balance = data.data.balance;
        this.walletInfo = data.data;
      }
    }, error => {
      this.loadingb = false;
    })
  }

  changeComponent(type_operation : any){
      this.showForm = false;
      if(this.type_operation != 4){
        this.sync = false;
        setTimeout(()=>{this.showForm = true}, 100);
      }
  }

  async showModalDownloading() {
    const modal = await this.modalController.create({
      component: DownloadInfoComponent,
      cssClass: 'my-custom-class',
      componentProps: { 'infoOffline' : this.walletInfo}
    });

    modal.onWillDismiss().then(data => {
      if(data.data.dismissed){
        this.listTransactions = []
        this.router.navigateByUrl("/home");
      }else{
        if(data.data.delete){
          //Descarto los cambios se llama al servicio y se limpia la lista
          if(this.listTransactions.length == 0){
            this.toastService.showToast('diemo-info', 'ÉXITO' , 'NO HAY TRANSACCIONES QUE DESCARTAR', 4000);
            this.router.navigateByUrl("/home");
            return
          }
          var req = {"device_id":this.device.uuid ,"offline_txs":this.listTransactions}
          this.userService.offlineRollBackTransactions(req).subscribe(data =>{
            if(data.data){
              this.toastService.showToast('diemo-info', 'ÉXITO' , 'TRANSACCIONES DESCARTADAS CON ÉXITO', 4000);
              this.homeRefreshService.setRefresh(true);
              this.router.navigateByUrl("/home");
            }
          },error => {
            this.loadingb = false;
            this.toastService.showToast('diemo-info', 'ERROR' , 'ERROR AL DESCARTAR TRANSACCIONES', 4000);
          })
          
        }
      }
    }).catch(error => {
    })

    return await modal.present();
  }

  async presentModalForm(type_operation : number) {
    const modal = await this.modalController.create({
      component: FormOperationsComponent,
      cssClass: 'my-custom-class',
      componentProps: { 'type_operation' : type_operation }
    });

    modal.onWillDismiss().then(data => {
      if(data.data['result']){
        //Guardamos la info en el arreglo por si acaso se va a descartar
        this.listTransactions.push(data.data['offline_txs'])
        this.walletOfflineBalance();
        this.transactionsComponent.getWalletOfflineTransactions();
      }
    }).catch(error => {
    })

    return await modal.present();
  }

  showExitConfirm() {
    if(!this.showExit){
      this.showExit = true;
      this.alertController.create({
        header: 'Guardar Wallet offline',
        message: 'Presione guardar para sincronizar su información offline',
        backdropDismiss: false,
        buttons: [{
          text: 'NO',
          role: 'cancel',
          handler: () => {
            this.showExit = false;
          }
        }, {
          text: 'GUARDAR',
          handler: () => {
            this.showExit = false;
            this.showModalDownloading();
            // navigator['app'].exitApp();
          }
        }]
      })
        .then(alert => {
          alert.present();
        });
    }

  }

  transform(num : number ){
    let number = num.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return number
  }

}
