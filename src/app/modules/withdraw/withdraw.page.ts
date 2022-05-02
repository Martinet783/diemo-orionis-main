import { Component, OnInit } from '@angular/core';
import { faMobileAlt,faHeart, } from '@fortawesome/free-solid-svg-icons';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.page.html',
  styleUrls: ['./withdraw.page.scss'],
})
export class WithdrawPage implements OnInit {

  faMobileAlt = faMobileAlt;
  showSegment : boolean;
  segment : string = '0';
  divisa : string;

  constructor() { }

  ngOnInit() {
    this.divisa = localStorage.getItem('divisa');
  }

  segmentChanged($event){
    this.segment = $event.detail.value;     
  }
}
