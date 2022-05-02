import { Component, OnInit } from '@angular/core';
import { faCode, faEnvelope, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-zelle-info',
  templateUrl: './zelle-info.component.html',
  styleUrls: ['./zelle-info.component.scss'],
})
export class ZelleInfoComponent implements OnInit {

  faUser = faUserTie;
  faMail = faEnvelope;
  faCode = faCode;

  me : string;

  constructor(private clipboard : Clipboard,
              private toast : Toast,
              private modalController : ModalController,
              private alertController : AlertController
    ) { }

  ngOnInit() {
    let me_json = JSON.parse(localStorage.getItem('user'));
    this.me = me_json.trace_id;
    this.presentAlert();
  }

  copy(text : string){
    this.clipboard.copy(text);
    this.toast.show(`Copiado en el portapapeles`, '4000', 'bottom').subscribe(
      toast => {
      }
    );
  }

  close(){
    this.modalController.dismiss();
  }

  async presentAlert(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'ATENCIÓN',
      message: 'Para la transferencia Zelle debe hacer uso del código único de recarga. Este debe ser ingresado en el campo de NOTE / MESSAGE / DESCRIPTION de la transferencia Zelle. De no ingresar el código único de recarga tendrá que comunicarse con el equipo de soporte para reclamar la transferencia, lo cual podría causar un retraso en la recarga de su billetera.',
      buttons: ['ACEPTO']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
  }

}
