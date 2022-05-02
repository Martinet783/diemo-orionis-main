import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-modal-code-sms',
  templateUrl: './modal-code-sms.component.html',
  styleUrls: ['./modal-code-sms.component.scss'],
})
export class ModalCodeSmsComponent implements OnInit {

  constructor(public modalController: ModalController,
              private routerOutlet: IonRouterOutlet) {
    
  }
  ngOnInit() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    return await modal.present();
  }

}
