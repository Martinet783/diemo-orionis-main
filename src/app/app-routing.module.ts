import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then( m => m.AuthModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'transactions',
    loadChildren: () => import('./modules/transactions/transactions.module').then( m => m.TransactionsPageModule)
  },
  {
    path: 'recharge',
    loadChildren: () => import('./modules/recharge/recharge.module').then( m => m.RechargePageModule)
  },
  {
    path: 'transfer',
    loadChildren: () => import('./modules/transfer/transfer.module').then( m => m.TransferPageModule)
  },
  {
    path: 'withdraw',
    loadChildren: () => import('./modules/withdraw/withdraw.module').then( m => m.WithdrawPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'offine',
    loadChildren: () => import('./modules/offine/offine.module').then( m => m.OffinePageModule)
  },
  {
    path: 'payments',
    loadChildren: () => import('./modules/payments/payments.module').then( m => m.PaymentsPageModule)
  },
  // {
  //   path: 'exchange',
  //   loadChildren: () => import('./modules/exchange/exchange.module').then( m => m.ExchangePageModule)
  // },
  {
    path: '**',
    redirectTo: 'auth/signin',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'auth/signin',
    pathMatch: 'full'
  },
  {
    path: 'exchange',
    loadChildren: () => import('./modules/exchange/exchange.module').then( m => m.ExchangePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
