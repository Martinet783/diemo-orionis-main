import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BalanceModule } from '../balance/balance.module';
import { DetailTransactionModule } from '../detail-transaction/detail-transaction.module';
import { QrModalComponent } from './qr-modal/qr-modal.component';
import { OrdersPageModule } from '../orders/orders.module';
import { CurrencyModule } from '../currency/currency.module';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    HomePageRoutingModule,
    BalanceModule,
    DetailTransactionModule,
    CurrencyModule,
    OrdersPageModule
  ],
  declarations: [HomePage, QrModalComponent],
  providers : [FingerprintAIO, NativeStorage]
})
export class HomePageModule {}
