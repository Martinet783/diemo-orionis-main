import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GetCurrencyService } from './service/get-currency.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyComponent implements OnInit {

  @Output() outputCurrency = new EventEmitter<any>();
  formGroup : FormGroup;
  submitted : boolean;

  constructor(private formBuilder : FormBuilder,
              private currencyService : GetCurrencyService) { } 

  ngOnInit(){
    this.formGroup = this.formBuilder.group({
      currency: ['', Validators.required]
    })
  }

  changeCurrency(){
    console.log(this.formGroup.value);
    this.currencyService.emit(this.formGroup.value);
  }

}
