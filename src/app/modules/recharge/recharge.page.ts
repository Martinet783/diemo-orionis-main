import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.page.html',
  styleUrls: ['./recharge.page.scss'],
})
export class RechargePage implements OnInit {

  @ViewChild('slides', { static: true }) slides: IonSlides;
  showSegment : string = 'banplus';
  divisa : string = "bs";
  slideOptions = {
    slidesPerView: 1,
    centeredSlides: true,
  }

  constructor() { }

  ngOnInit() {
    this.divisa = localStorage.getItem('divisa');
    if(this.divisa =='usd'){
      document.querySelector('ion-slides').slideTo(0);
    }
  }

  segmentChanged($event){
    let segment = $event.detail.value;
    document.querySelector('ion-slides').slideTo(segment);
    //console.log(segment)
    //this.showSegment = (segment) ? segment : 'banplus'; 
  }

  getIndex() { 
    this.slides.getActiveIndex().then(index => {
      document.querySelector('ion-segment').value = String(index);
    });
  }
  
}
