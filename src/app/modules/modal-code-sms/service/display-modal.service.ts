import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisplayModalService {

  private displayBehavior = new BehaviorSubject<boolean>(null);
  public modalObservable = this.displayBehavior.asObservable();

  constructor() { }

  setShow(show : boolean){
    this.displayBehavior.next(show);
  }
}
