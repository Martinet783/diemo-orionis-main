import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private api : ApiService) { }

  getWalletMoneyBalances(){
    return this.api.get("/api/wallet/money/balances", {});
  }

  getWalletMoneyTransactions(req : any){
    return this.api.post(req ,"/api/wallet/money/transactions", {});
  }

  walletMoneyTransfer(obj : any){
    return this.api.post(obj, "/api/wallet/money/transfer", {});
  }

  walletMoneyBalances(){
    return this.api.get("/api/wallet/money/balances", {});
  }

  walletTransfer(req : any){
    return this.api.post(req, "/api/wallet/money/transfer", {});
  }
  walletBankP2CBanks(req : any){
    return this.api.get("/api/wallet/bank/P2CBanks", {});
  }

  walletBankValidateManualReference(){
    return this.api.post({}, '/api/wallet/bank/validateManualReference', {});
  }

  walletContacts(req : any){
    return this.api.post(req, '/api/wallet/contacts', {});
  }

  walletContactEdit(req : any){
    return this.api.post(req, '/api/wallet/contact/edit', {});
  }

  walletContactDelete(req : any){
    return this.api.post(req, '/api/wallet/contact/delete', {});
  }

  walletMoneyWithdraw(req : any){
    return this.api.post(req, '/api/wallet/money/withdraw', {});
  }

  walletMoneyWithdrawP2C(req: any){
    return this.api.post(req, '/api/wallet/money/p2cWithdraw', {});
  }

  getP2CBanks(){
    return this.api.getBanks({});
  }

  walletUpdatePIN(req : any){
    return this.api.post(req, '/api/wallet/auth/updatePIN', {});
  }

  walletUpdatePassword(req : any){
    return this.api.post(req, '/api/wallet/auth/updatePassword', {});
  }

  walletUpdate(req : any){
    return this.api.post(req, '/api/wallet/auth/update', {});
  }

  walletOfflineBalanceUpdate(req){
    return this.api.post(req, '/api/wallet/offline/balanceUpdate', {});
  }


  getWalletOfflineBalance(req){
    return this.api.post(req,'/api/wallet/offline/balance', {});
  }

  getWalletOfflineTransactions(req){
    return this.api.post(req,'/api/wallet/offline/transactions', {});
  }

  getScannedUserInfo(req){
    return this.api.post(req, '/api/wallet/user', {});
  }

  confirmPayment(req : any){
    return this.api.post(req, "/api/pos/money/confirmPayment" ,{}) 
  }

  confirmOrder(req : any){
    return this.api.post(req, "/api/pos/money/confirmOrder" ,{}) 
  }

  moneyTransactions(id : string){
    return this.api.get("/api/pos/money/transaction/" + id , {}) 
  }

  walletMoneyTransactions(id : string){
    return this.api.post( {"trace_number": id}, "/api/wallet/money/transaction/", {}) 
  }

  updateSecurityWorld(req : any){
    return this.api.post(req,"/api/wallet/offline/update", {}) 
  }

  posMoneyMyOrders(req : any){
    return this.api.post(req, "/api/pos/money/myOrders", {});
  }

  walletBankValidateReference(req : any){
    return this.api.post(req, "/api/wallet/bank/validateReference", {});
  }

  bankLiquidar(req : any){
    return this.api.post(req, "/api/wallet/bank/liquidar", {});
  }

  bankConversionUsd(req : any){
    return this.api.post(req, "/api/wallet/bank/liquidar", {});
  }

  walletBankExchangeRate(){
    return this.api.get("/api/wallet/bank/exchangeRate", {});
  }

  wallletPreAfiliation(req:any){
    return this.api.post(req,"/api/wallet/bank/affiliation",{})
  }

  offlineRollBackTransactions(req:any){
    return this.api.post(req,"/api/wallet/offline/discardChange",{})
  }
}
