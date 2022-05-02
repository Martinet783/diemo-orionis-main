import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferPageRoutingModule } from './transfer-routing.module';

import { TransferPage } from './transfer.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalContactsComponent } from './modal-contacts/modal-contacts.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DetailTransactionModule } from '../detail-transaction/detail-transaction.module';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NgxCurrencyModule } from "ngx-currency";
import { BalanceModule } from '../balance/balance.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TransferPageRoutingModule,
    FontAwesomeModule,
    DetailTransactionModule,
    NgxCurrencyModule,
    BalanceModule

  ],
  declarations: [TransferPage, ModalContactsComponent],
  providers: [BarcodeScanner, FingerprintAIO, NativeStorage]
})
export class TransferPageModule {}
