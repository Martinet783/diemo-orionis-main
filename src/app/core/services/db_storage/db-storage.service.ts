import { ElementRef, Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { AuthService } from '../auth/auth.service';
import { sha256, sha224 } from 'js-sha256';
import * as CryptoJS from 'crypto-ts';
import { Offline } from '../../models/offline';

@Injectable({
  providedIn: 'root'
})
export class DbStorageService {

  constructor(private toastService : ToastService,
              private authService : AuthService) { }

  setInDb(item : any, key: string){
    localStorage.setItem(key, JSON.stringify(item));
  }

  getDataDb(key : string){
    return JSON.parse(localStorage.getItem(key))
  }

  getBalanceOffline(securityWorld){
    let dataOffline : Offline = this.decrypt(securityWorld);
    return dataOffline.balance;
  }

  addElementInStorage(item : any, key : string){
    if(!this.verifyCollectionInDb(key)){
      let transactionsInit = Array();
      transactionsInit.push(item);
      this.setInDb(transactionsInit, key);
    }else{
      let collection = JSON.parse(localStorage.getItem(key));
      collection.push(item);
      this.setInDb(collection, key);
    }
  }

  verifyCollectionInDb(key : string){
    let collection = (localStorage.getItem(key)) ? true : false; 
    
    return collection;
  }

  modifyBalance(amount : number, securityWorld : string){
    
   let dataOffline : Offline = this.decrypt(securityWorld);
    console.log(dataOffline);  
    dataOffline.balance = dataOffline.balance - amount; 
    console.log(dataOffline);  
    this.encrypt(dataOffline, securityWorld);
    return dataOffline.balance;
  }

  sync(idWallet : string){
    if(this.verifyCollectionInDb('qr_generate')){
      let dataQR = this.getDataDb('qr_generate');
      let arrayWalletId:Array<any> = this.getDataDb('OfflineMsj')
      if(arrayWalletId == null){arrayWalletId = []}
      dataQR.forEach(element => {
        if(arrayWalletId.indexOf(element.idWallet) < 0){
          //Agrego el id del wallet para saber a quien debo mostrarle la notificacion de transacciones sincronizadas
          arrayWalletId.push({"idWallet":element.idWallet})
        } 
      });
      //Guardo en local storage
      this.setInDb(arrayWalletId,"OfflineMsj")
      let req = {'is_pos': false, 
      pagos: this.getDataDb('qr_generate')}
      this.walletOfflinePaymentsSync(req,idWallet); 
  }else{
    //BUsco en local storage si tengo que mostrarle notificacion de transacciones sincronizadas
    //Esto puede pasar ya que se envian todas las transacciones offline del dispositivo sin importar la cuenta
    let showofflie: Array<any> = this.getDataDb('OfflineMsj')
    if(showofflie != null && showofflie.some(e => e.idWallet === idWallet)){
      //Si existe el idwallet entonces muestro el toast y borro ese elemento de la lista ya que fue mostrado.
      this.toastService.showToast('banplus-neutral', 'ÉXITO', 'TRANSACCIONES SINCRONIZADAS.');
      var items = showofflie.filter(item => item.idWallet !== idWallet);
      this.setInDb(items,'OfflineMsj')
      return
    }

    //No consegui el idWallet en la lista de wallets a los que se le debe decir que sincronizo las transacciones
    this.toastService.showToast('banplus-neutral', 'INFORMACIÓN', 'NO POSEE TRANSACCIONES SIN CONEXIÓN');
  }
}


walletOfflinePaymentsSync(req : any,idWallet:string){
  console.log("walletOfflinePaymentsSync", req);
  this.authService.walletOfflinePayment(req).subscribe(data => {
    console.log(data);
    if(data.data){
      //Se sincronizaron TODAS las transacciones offline
      //Tengo que buscar si el idWallet esta en la lista de wallets al que mostrat que se sincronizaron las transacciones
      let showofflie = this.getDataDb('OfflineMsj')
      if(showofflie != null && showofflie.some(e => e.idWallet === idWallet)){
        //Si lo consigo muestro y borro de la lista
        this.toastService.showToast('banplus-neutral', 'ÉXITO', 'TRANSACCIONES SINCRONIZADAS.');
        var items = showofflie.filter(item => item.idWallet !== idWallet);
        this.setInDb(items,'OfflineMsj')
      }else{
        //A pesar que sincronice las transacciones no se le muestra que se sincronizo ya que este wallet no tenia 
        //transacciones offline en el dispositivo.
        this.toastService.showToast('banplus-neutral', 'INFORMACIÓN', 'NO POSEE TRANSACCIONES SIN CONEXIÓN');
      }
      localStorage.removeItem('qr_generate');
    }
  }, error => {
    console.log(error);
  })
}


decrypt(securityWorld : string){
    var bytes  = CryptoJS.AES.decrypt(localStorage.getItem('aes'), sha256(securityWorld));
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);    
    return JSON.parse(plaintext);
}

encrypt(dataOffline : Offline, securityWorld){
  const encryptedMessage = CryptoJS.AES.encrypt(JSON.stringify(dataOffline), sha256(securityWorld)).toString();
  localStorage.setItem('aes', encryptedMessage);  
}

}
