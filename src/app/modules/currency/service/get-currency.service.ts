import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetCurrencyService {

  private currencyBehavior = new BehaviorSubject<any>(null);
  public currencyObservable = this.currencyBehavior.asObservable();

  constructor() { }

  emit(currency : any){
    this.currencyBehavior.next(currency);
  }
}
