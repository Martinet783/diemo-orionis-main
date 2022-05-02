import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }

      const valid = regex.test(control.value);

      return valid ? null : error;
    };
  }

  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; 
    const repeat_password: string = control.get('repeat_password').value;

    if (password !== repeat_password) {
      control.get('repeat_password').setErrors({ NoPassswordMatch: true });
    }
  }

  static passwordChangeMatchValidator(control: AbstractControl) {
    const NewPassword: string = control.get('NewPassword').value; 
    const NewPassword2: string = control.get('NewPassword2').value; 
    
    if (NewPassword !== NewPassword2) {
      control.get('NewPassword2').setErrors({ NoPassswordMatch: true });
    }
  }

  static emailChangeMatchValidator(control: AbstractControl) {
    const emailID: string = control.get('emailID').value; 
    const emailID_match: string = control.get('emailID_match').value; 
    
    if (emailID !== emailID_match) {
      control.get('emailID_match').setErrors({ NoEmailIDMatch: true });
    }
  }
}