import { Component, OnInit, Output, EventEmitter, Input, AfterContentInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalDetailComponent } from './modal-detail/modal-detail.component';
import { IonRouterOutlet } from '@ionic/angular';
import { Transactions } from 'src/app/core/models/transactions';

@Component({
  selector: 'detail-transaction',
  templateUrl: './detail-transaction.component.html',
  styleUrls: ['./detail-transaction.component.scss'],
})
export class DetailTransactionComponent implements OnInit, AfterContentInit {

  @Input()transaction : Transactions;
  @Output()close = new EventEmitter<boolean>(null);

  constructor(public modalController: ModalController,
              private routerOutlet: IonRouterOutlet) { }

  ngOnInit() {
    // alert("presentModalDetail");
}
  
  ngAfterContentInit(){
    this.presentModal();
  }


  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalDetailComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps : { 'transactions': this.transaction }
    });
    
    await modal.present();
    
    const { data } = await modal.onWillDismiss();
    this.close.emit(data?.dismissed);
  }

}
