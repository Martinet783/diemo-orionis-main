import { Component, OnInit } from '@angular/core';
import { PayOffline } from 'src/app/core/models/pay_offline';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { Configuration } from 'src/app/core/models/configuration';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user/user.service';
import { sha256, sha224 } from 'js-sha256';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'sync-component',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss'],
})
export class SyncComponent implements OnInit {
  
  faSyncAlt = faSyncAlt;
  isSubmitted : boolean;
  configuration : Configuration;
  form : FormGroup;
  faSpinner = faSpinner;
  loading : boolean;

  constructor(private formBuilder : FormBuilder,
              private userService : UserService,
              private toastService : ToastService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      date : [null]
    })
  }

  get f(){ return this.form.controls; }

  sync(){
    this.isSubmitted = true;
    if(this.form.invalid){ return; }
    let config = this.form.value;
    
    if(config.sw != null || config.date != null){
      this.loading = true;
      this.userService.updateSecurityWorld(config).subscribe(data => {
        this.loading = false;
          if(data.data){
            this.form.reset();
            this.toastService.showToast('banplus-neutral', 'ÉXITO', data.data, 4000);
          }
      }, error => {
        this.loading = false;
        if(error.error.code){
          this.toastService.showToast('danger', 'ERROR', error.error.msg);
        }
      })
    }else{
      this.toastService.showToast('banplus-neutral', 'IMPORTANTE', 'DEBE INGRESAR AL MENOS UN CAMPO' , 4000);
    }
  }
}
