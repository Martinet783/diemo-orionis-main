import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenFirebaseService {

  private tokenBehavior = new BehaviorSubject<any>(null);
  public tokenObservable = this.tokenBehavior.asObservable();

  constructor() { }

  setToken(token : string){
    this.tokenBehavior.next(token);
  }
}
