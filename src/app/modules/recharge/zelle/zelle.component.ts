import { Component, OnInit } from '@angular/core';
import { faEnvelope, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ZelleInfoComponent } from './zelle-info/zelle-info.component';

@Component({
  selector: 'app-zelle',
  templateUrl: './zelle.component.html',
  styleUrls: ['./zelle.component.scss'],
})
export class ZelleComponent implements OnInit {

  faMail = faEnvelope;
  faUser = faUserTie;
  me : string;
  loading : Boolean = false;

  constructor(
    private clipboard : Clipboard,
    private toast : Toast,
    private modalController : ModalController
  ) { }

  ngOnInit() {
    let me_json = JSON.parse(localStorage.getItem('user'));
    this.me = me_json.trace_id;
    }

  async presentModal(){
    const modal = await this.modalController.create({
      component: ZelleInfoComponent,
      cssClass: 'my-custom-class',
      componentProps:{
        'ValidationType': 2
      }
    });
    return await modal.present();
  }

}
