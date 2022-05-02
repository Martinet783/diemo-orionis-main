import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController : ToastController) { }

  async showToast(color : string, title: string, message: string, duration : number = 3000) {
    const toast = await this.toastController.create({
      header: title,
      message: message,
      position: 'bottom',
      animated: true,
      duration: duration,
      color: color,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
}
