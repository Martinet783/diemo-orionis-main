import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/core/services/user/user.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { sha256 } from 'js-sha256';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-pin',
  templateUrl: './change-pin.component.html',
  styleUrls: ['./change-pin.component.scss'],
})
export class ChangePinComponent implements OnInit {

  changepinForm : FormGroup;
  faSpinner = faSpinner;
  isSubmitted : boolean;
  loading : boolean = false;
  submitted : boolean = false;

  constructor(private formBuilder : FormBuilder,
              private userService : UserService,
              private toastService : ToastService,
              private router : Router) { }

  ngOnInit() {
    this.changepinForm = this.formBuilder.group({
      newPIN: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]*')]],
      newPIN2: ['', [Validators.required , Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]*')]]
    },{
      validator: [this.pinMatch]
    })
  }

  get f(){
    return this.changepinForm.controls;
  }
  
  onSubmit(){
    this.isSubmitted = true;
    if(this.changepinForm.invalid){ return; }
    console.log(this.changepinForm.value);
    let req = {...this.changepinForm.value};
    req.newPIN = sha256(req.newPIN);
    delete req.newPIN2;
    this.walletUpdatePIN(req);
  }

  onKeyPin(pinForm){  
    let pin = String(pinForm.value);
    let regexp = new RegExp(/^[0-9]{1,4}$/);
    let valid_pin = regexp.test(pin) ? pin : pin.slice(0, 4);
    this.f.newPIN.setValue(valid_pin);
  }

  walletUpdatePIN(req : any){
    this.loading = true;
    this.userService.walletUpdatePIN(req).subscribe(data => {
      if(data.code){
        this.toastService.showToast('banplus-neutral', 'INFO', data.msg);
      }else if(data.status){
        this.toastService.showToast('success', 'ÉXITO', data.status, 4000);
        this.router.navigateByUrl('profile');
      }
      this.loading = false;
      this.changepinForm.reset();
      this.isSubmitted = false;
    }, error =>{
      this.loading = false;
    })
  }

  pinMatch(control: AbstractControl) {
    const newPIN: string = control.get('newPIN').value; 
    const newPIN2: string = control.get('newPIN2').value;
    if (newPIN !== newPIN2) {
      control.get('newPIN2').setErrors({ NoPinMatch: true });
    }
  }


}
