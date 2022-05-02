import { Component, OnInit } from '@angular/core';
import { faMobileAlt, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/core/services/user/user.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { Router } from '@angular/router';
import { HomeRefreshService } from 'src/app/core/services/home-refresh/home-refresh.service';
import { ModalController } from '@ionic/angular';
import { BankFormComponent } from '../bank-transfer/bank-form/bank-form.component';


@Component({
  selector: 'mobile-pay',
  templateUrl: './mobile-pay.component.html',
  styleUrls: ['./mobile-pay.component.scss'],
})
export class MobilePayComponent implements OnInit {

  faUniversity = faUniversity;
  faMobileAlt = faMobileAlt;

  constructor(private userService : UserService,
              private toastService : ToastService,
              private clipboard : Clipboard,
              private router : Router,
              public modalController : ModalController,
              private homeRefreshService : HomeRefreshService,
              private toast : Toast) {}

  ngOnInit() {}

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
        'ValidationType': 1
      }
    });
    return await modal.present();
  }
}
