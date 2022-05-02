import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffinePage } from './offine.page';
import { QrPayComponent } from './qr-pay/qr-pay.component';

const routes: Routes = [
  {
    path: '',
    children: [{path: '', component: OffinePage},
               {path: 'qr', component: QrPayComponent}]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffinePageRoutingModule {}
