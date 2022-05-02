import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../signup/custom-validators/custom-validators';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { sha256 } from 'js-sha256';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'change-password-init',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  @Input('idUser') idUser : string;
  passwordForm : FormGroup;
  isSubmitted : boolean;
  loading : boolean = false;
  faSpinner = faSpinner;

  constructor(private formBuilder : FormBuilder,
              private authService : AuthService,
              private toastService : ToastService,
              private router : Router) { }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
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
      repeat_password: ['', Validators.required]
    },
    {
      validator: CustomValidators.passwordMatchValidator
    })
  }

  get f(){ return this.passwordForm.controls; }

  onSubmit(){
    this.isSubmitted = true;
    if(this.passwordForm.invalid){return;}
    let req = { 'idUser': this.idUser, 'NewPassword' : sha256(this.passwordForm.value['password'])}
    this.updatePassword(req);
  }

  updatePassword(req : any){
    this.loading = true;
    this.authService.authUpdatePassword(req).subscribe(data => {
      this.loading = false;
      if(data.code){
        this.toastService.showToast('banplus-light', 'IMPORTANTE', data.msg, 3000);
      }
      
      if(data.data){
        this.toastService.showToast('banplus-secondary', 'ÉXITO', data.data, 3000);
        this.router.navigateByUrl('auth/signin');
      }
    }, error => {
      this.loading = false;
    })
  }

}