import { MobilePayComponent } from './mobile-pay/mobile-pay.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WithdrawPageRoutingModule } from './withdraw-routing.module';
import { WithdrawPage } from './withdraw.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalFavoritesComponent } from './modal-favorites/modal-favorites.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { BalanceModule } from '../balance/balance.module';
import { OutBanplusComponent } from './out-banplus/out-banplus.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    WithdrawPageRoutingModule,
    NgxCurrencyModule,
    BalanceModule
  ],
  declarations: [WithdrawPage, MobilePayComponent, ModalFavoritesComponent,OutBanplusComponent]
})
export class WithdrawPageModule {}
