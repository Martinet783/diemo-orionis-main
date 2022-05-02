import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExchangePageRoutingModule } from './exchange-routing.module';

import { ExchangePage } from './exchange.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BalanceModule } from '../balance/balance.module';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ExchangePageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    BalanceModule,
    NgxCurrencyModule
  ],
  declarations: [ExchangePage]
})
export class ExchangePageModule {}
