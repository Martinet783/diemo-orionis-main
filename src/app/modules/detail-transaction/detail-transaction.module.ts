import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailTransactionComponent } from './detail-transaction.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalDetailComponent } from './modal-detail/modal-detail.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [DetailTransactionComponent, ModalDetailComponent],
  imports: [
    CommonModule,
    IonicModule,
    FontAwesomeModule
  ],
  exports: [DetailTransactionComponent]
})
export class DetailTransactionModule { }
