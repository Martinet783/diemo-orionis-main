import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RechargePage } from './recharge.page';
import { BankFormComponent } from './bank-transfer/bank-form/bank-form.component'

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: RechargePage},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RechargePageRoutingModule {}
