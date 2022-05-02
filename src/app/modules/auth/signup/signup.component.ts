import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { sha256 } from 'js-sha256';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CustomValidators } from './custom-validators/custom-validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  signupForm : FormGroup;
  isSubmitted : boolean = false;
  loading : boolean = false;
  faSpinner = faSpinner;
  tyc : boolean = false;
  sign = "walletplus";

  constructor(public router : Router,
              private formBuilder : FormBuilder,
              private authService : AuthService,
              private toastService : ToastService) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      firstName : ['', [Validators.required, Validators.pattern('[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ ]*')]],
      lastName : ['', [Validators.required, Validators.pattern('[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ ]*')]],
      birthdate : ['', Validators.required],
      idGender : ['', Validators.required],
      emailID : ['', [Validators.required, Validators.email]],
      emailID_match : ['', [Validators.required, Validators.email]],
      idDocumentType : ['', Validators.required],
      documento : ['', [Validators.required, Validators.pattern('[0-9]*')]],
      operator : ['', Validators.required],
      subPhoneNo : ['', [Validators.required,  Validators.pattern('[0-9]*')]],
      user : ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._]*')]],
      password: ['', Validators.compose(
        [ Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          CustomValidators.patternValidator(/\d/, {
            hasNumber: true
          }),
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          CustomValidators.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          CustomValidators.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            {
              hasSpecialCharacters: true
            }
          )
        ])],
      repeat_password: ['', Validators.required],
      pin: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('[0-9]*')]],
      invitationCode: [null]
    },
    {
      validator: [CustomValidators.passwordMatchValidator, 
                  CustomValidators.emailChangeMatchValidator],
    })

  }

  get f(){ return this.signupForm.controls; }

  onKeyPin($event, pinForm){  
    let pin = pinForm.value;
    let regexp = new RegExp(/^[0-9]{1,4}$/);
    let valid_pin = regexp.test(pin) ? pin : pin.slice(0, 4);
    this.f.pin.setValue(valid_pin);
  }

  onKeyPhone($event, phoneForm){  
    let phone = String(phoneForm.value);
    let regexp = new RegExp(/^[0-9]{7}$/);
    let valid_phone = regexp.test(phone) ? phone : phone.slice(0, 7);
    this.f.subPhoneNo.setValue(valid_phone);
  }

  submitForm(){
    this.isSubmitted = true;
    if(this.signupForm.invalid){ return; }
    let user : User = this.validateUserJson({...this.signupForm.value});

    this.signUp(user);
  }

  validateUserJson(user : User) : User{
    user.subPhoneNo = "58" + user.operator + user.subPhoneNo;
    let birthdate = user.birthdate.split("T")[0].split("-");
    user.birthdate = birthdate[2]+"/"+birthdate[1]+"/"+birthdate[0];
    user.password = sha256(user.password);
    user.pin = sha256(String(user.pin));
    user.documento = String(user.documento);
    user.subPhoneNo = String(user.subPhoneNo);
    user.idGender = Number(user.idGender);
    user.idDocumentType = Number(user.idDocumentType);
    user.subName = user.firstName + ' ' + user.lastName;
    user.user = user.user.trim();
    user.sign = this.sign;

    return user;
  }

  signUp(user : User){
    // this.loading.showLoading();
    this.loading = true;
    delete user.repeat_password;
    delete user.emailID_match;
    this.authService.authSignup(user).subscribe(data => {
      this.loading = false;
      if(data.data){
        this.toastService.showToast("banplus-secondary", "ÉXITO", data.data);
        this.router.navigateByUrl("auth/signin");
      }
    }, error => {
      this.loading = false;
      if(error.error.code == 521){
        this.toastService.showToast("danger", "ERROR", "EL CORREO ELECTRÓNICO YA SE ENCUENTRA REGISTRADO");
      }else{
        this.toastService.showToast("danger", "ERROR", error.error.msg);
      }
    })
  }
}
