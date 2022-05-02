import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CustomValidators } from 'src/app/modules/auth/signup/custom-validators/custom-validators';
import { UserService } from 'src/app/core/services/user/user.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  
  changepasswordForm : FormGroup;
  isSubmitted : Boolean;
  loading : boolean = false;
  faSpinner = faSpinner;

  pwdIcon = "eye-outline";
  pwdIcon2 = "eye-outline";
  pwdIcon3 = "eye-outline";
  showPwd = false;
  showPwd2 = false;
  showPwd3 = false;

  constructor(private formBuilder : FormBuilder,
              private userService : UserService,
              private toastService : ToastService,
              private router : Router,
              private alertController : AlertController) { }

  ngOnInit() {
    this.changepasswordForm = this.formBuilder.group({
      CurrentPassword: ['', Validators.required],
      NewPassword: ['', Validators.compose(
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
      NewPassword2: ['', Validators.required]
    },
    {
      validator: CustomValidators.passwordChangeMatchValidator
    })
  }

  get f(){ return this.changepasswordForm.controls; }
  
  onSubmit(){
    this.isSubmitted = true;
    if(this.changepasswordForm.invalid){ return; }

    let form = this.changepasswordForm.value;
    form.CurrentPassword = sha256(form.CurrentPassword);
    form.NewPassword = sha256(form.NewPassword);
    delete form.NewPassword2; 
    this.walletUpdatePassword(form);
  }

  togglePwd(){
    this.showPwd = !this.showPwd;
    this.pwdIcon = this.showPwd ? "eye-off-outline" : "eye-outline";
  }

  togglePwd2(){
    this.showPwd2 = !this.showPwd2;
    this.pwdIcon2 = this.showPwd2 ? "eye-off-outline" : "eye-outline";
  }

  togglePwd3(){
    this.showPwd3 = !this.showPwd3;
    this.pwdIcon3 = this.showPwd3 ? "eye-off-outline" : "eye-outline";
  }

  async information(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'La clave debe contener: - Mínimo 8 caracteres y Máximo 16 caracteres - Al menos un caracter en Mayúscula - Al menos un caracter numérico - Al menos un caracter especial - Sin espacios en blanco - Sin relación con sus datos personales y/o institución financiera.',
      buttons : ['ACEPTAR']
    });

    await alert.present();
  }

  walletUpdatePassword(req : any){
    this.loading = true;
    this.userService.walletUpdatePassword(req).subscribe(data => {
      if(data.code){
        this.toastService.showToast('danger', 'ERROR', data.msg);
      }else if(data.data){
        this.toastService.showToast('success', 'ÉXITO', "Contraseña cambiada exitosamente", 4000);
        this.router.navigateByUrl('profile');
      }
      this.loading = false;
      this.changepasswordForm.reset();
      this.isSubmitted = false;
    }, error =>{
      this.loading = false;
    })
  }


}
