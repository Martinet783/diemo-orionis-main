import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RechargePageRoutingModule } from './recharge-routing.module';

import { RechargePage } from './recharge.page';
import { BankTransferComponent } from './bank-transfer/bank-transfer.component';
import { MobilePayComponent } from './mobile-pay/mobile-pay.component';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BankFormComponent } from './bank-transfer/bank-form/bank-form.component';
import { BanplusComponent } from './banplus/banplus.component';
import { ZelleComponent } from './zelle/zelle.component';
import { NgxCurrencyModule } from "ngx-currency";
import { ZelleInfoComponent } from './zelle/zelle-info/zelle-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RechargePageRoutingModule,
    FontAwesomeModule,
    NgxCurrencyModule
  ],
  declarations: [RechargePage, BanplusComponent, MobilePayComponent, BankTransferComponent, BankFormComponent, ZelleComponent, ZelleInfoComponent],
  providers: [Clipboard, Toast]
})
export class RechargePageModule {}
