import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api : ApiService) { }

  authSignin(user : any){
    return this.api.post(user, "/api/wallet/auth/signin", {});
  }

  authSignup(user : User){
    return this.api.post(user, "/api/wallet/auth/signup", {});
  }

  authRecoveryPassword(email : any){
    return this.api.post(email, "/api/wallet/auth/recoveryPassword", {});
  }

  authUpdatePassword(req : any){
    return this.api.post(req, "/api/wallet/auth/updatePassword", {});
  }

  authVerifyCode(code : string, ci : string){
    return this.api.get("/api/wallet/auth/verifyCode/" + code + "/" + ci, {});
  }

  walletAuthCheckSMSCode(req : any){
    return this.api.post(req , "/api/wallet/auth/checkSMScode", {});
  }

  resendSMSCode(req : any){
    return this.api.post(req , "/api/wallet/auth/resendSMScode", {});
  }

  walletOfflinePayment(req : any){
    return this.api.post(req ,"/api/wallet/offline/payment", {});
  }

  fingerLogin(req : any){
    return this.api.post(req ,"/api/wallet/auth/fingerLogin", {});
  }
}
