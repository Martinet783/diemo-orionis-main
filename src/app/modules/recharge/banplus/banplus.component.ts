import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-banplus',
  templateUrl: './banplus.component.html',
  styleUrls: ['./banplus.component.scss'],
})
export class BanplusComponent implements OnInit {

  faSpinner = faSpinner;

  constructor() { }

  ngOnInit() {}

  openUrl(){
    window.open('https://www.banplus.com/site/p_contenido.php','_blank');
  }

}
