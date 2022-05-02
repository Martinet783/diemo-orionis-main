import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertBehavior = new BehaviorSubject<boolean>(false);
  public showObservable = this.alertBehavior.asObservable();

  constructor(private alertController : AlertController) { }

  async presentAlertConfirm(
    header : string = "Confirm!", 
    message : string = "Message <strong>text</strong>!!!", 
    button_ok : string = "Ok", 
    button_cancel : string = "Cancelar") {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [
        {
          text: button_cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.alertBehavior.next(false);
          }
        }, {
          text: button_ok,
          handler: () => {
            localStorage.removeItem('Authorization');
            this.alertBehavior.next(true);
            navigator['app'].exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

  async closeAlert(){
    this.alertController.dismiss();
    this.alertBehavior.next(false);
  }
}
