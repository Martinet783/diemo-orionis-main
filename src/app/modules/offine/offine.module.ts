import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OffinePageRoutingModule } from './offine-routing.module';
import { OffinePage } from './offine.page';
import { FormOperationsComponent } from './form-operations/form-operations.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TransactionsComponent } from './transactions/transactions.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { QrPayComponent } from './qr-pay/qr-pay.component';
import { SyncComponent } from './sync/sync.component';
import { DownloadInfoComponent } from './download-info/download-info.component';
import { DetailTransactionModule } from '../detail-transaction/detail-transaction.module';
import { QRCodeModule } from 'angular2-qrcode';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FontAwesomeModule,
    QRCodeModule,
    OffinePageRoutingModule,
    DetailTransactionModule,
    NgxCurrencyModule
  ],
  declarations: [OffinePage, 
    FormOperationsComponent, 
    TransactionsComponent, 
    QrPayComponent,
    SyncComponent,
    DownloadInfoComponent],
  providers: [BarcodeScanner]
})
export class OffinePageModule {}
