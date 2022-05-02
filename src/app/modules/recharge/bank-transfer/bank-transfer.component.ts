import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { faSpinner, faMobileAlt, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/core/services/user/user.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Router } from '@angular/router';
import { HomeRefreshService } from 'src/app/core/services/home-refresh/home-refresh.service';
import { ModalController } from '@ionic/angular';
import { BankFormComponent } from './bank-form/bank-form.component';


@Component({
  selector: 'bank-transfer',
  templateUrl: './bank-transfer.component.html',
  styleUrls: ['./bank-transfer.component.scss'],
})
export class BankTransferComponent implements OnInit {

  faSpinner = faSpinner;
  faUniversity = faUniversity;
  faMobileAlt = faMobileAlt;
  loading : Boolean = false;

  constructor(private clipboard : Clipboard,
              private toast : Toast,
              private userService : UserService,
              private router : Router,
              private homeRefreshService : HomeRefreshService,
              private modalController : ModalController,
              private toastService : ToastService) { }

  ngOnInit() {}

  // recharge(){
  //   this.loading = true;
  //   this.userService.walletBankValidateManualReference().subscribe(data => {
  //     this.loading = false;
  //     if(data.status == 0){
  //       this.toastService.showToast('diemo-info', 'INFO', "NO TIENE RECARGAS PENDIENTES")
  //     }else if(data.status == 1){
  //       this.toastService.showToast('success', 'ÉXITO', "RECARGA ÉXITOSA")
  //       this.homeRefreshService.setRefresh(true);
  //       this.router.navigateByUrl('/home');
  //     }
  //   }, error => {
  //     this.loading = false;
  //     if(error.error.code){
  //       this.toastService.showToast('danger', 'ERROR', "OCURRIÓ UN ERROR REALIZANDO LA RECARGA, INTENTE DE NUEVO MÁS TARDE", 4000);
  //     }
  //   })
  // }

  copy(text : string){
    this.clipboard.copy(text);
    this.toast.show(`Copiado en el portapapeles`, '4000', 'bottom').subscribe(
      toast => {
        // console.log(toast);
      }
    );
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: BankFormComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'ValidationType': 2
      }
    });
    return await modal.present();
  }

}
