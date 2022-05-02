import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeRefreshService {

  private homeBehavior = new BehaviorSubject<boolean>(null);
  public observableHome = this.homeBehavior.asObservable();

  constructor() { }

  setRefresh(refresh : boolean){
    this.homeBehavior.next(refresh);
  }
}
