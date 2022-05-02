import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user/user.service';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profileForm : FormGroup;
  slideOpts = { slidesPerView: 2.5 }; 
  user : User = new User();
  loading : boolean = false;
  isSubmitted : boolean;
  faTimes = faTimes;
  faSpinner = faSpinner;
  showForm : boolean = false;
  finger : boolean = false;
  version: any
  statusA: string;
  showPreafiliar :boolean = false;
  showAfiliar: boolean = false;

  constructor(private formBuilder : FormBuilder,
              private nativeStorage : NativeStorage,
              private userService : UserService,
              private toastService : ToastService,
              private appVersion: AppVersion) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.appVersion.getVersionNumber().then(res => {
      this.version = res;
    }).catch(error => {
      console.log(error);
    });

    this.profileForm = this.formBuilder.group({
      emailID:  ['', [Validators.required, Validators.email]],
      phoneNo: [''],
      subPhoneNo: ['', [Validators.required, Validators.maxLength(7), Validators.minLength(7), Validators.pattern('[0-9]*')]],
      operator: ['', Validators.required]
    })

    this.nativeStorage.getItem('faio')
    .then(data => {
        if(data){
          this.finger = true;
        }
      },error => console.error(error));
    
      if(!this.user.hasOwnProperty('affiliation')){
        this.statusA = "SIN PREAFILIAR";
        this.showPreafiliar = true;
      }else{
        switch(this.user['affiliation'][0]['Status']){
          case 0:
              this.statusA = "PREAFILIADO"
              this.showAfiliar = true
            break
          case 1:
              this.statusA = "AFILIADO"
            break
          case 2:
            this.statusA = "RECHAZADA"
          break
          default:
            this.statusA = "--"
            break;
        }
      }

  }

  get f(){ return this.profileForm.controls; }

  onKeyPhone(subPhoneNoForm){
    let subPhoneNo = String(subPhoneNoForm.value);
    let regexp = new RegExp(/^[0-9]{1,7}$/);
    let valid_subPhoneNo = regexp.test(subPhoneNo) ? subPhoneNo : subPhoneNo.slice(0, 7);
    this.f.subPhoneNo.setValue(valid_subPhoneNo);
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.profileForm.invalid){return;}
    let user : User = this.profileForm.value;
    user.phoneNo = "58"+user.operator+user.subPhoneNo;
    user.user = this.user.user;
    this.updateProfile(user);
  }

  dataInForm(form : any){
    this.profileForm.setValue({ 'emailID': this.user.emailID, 
                                'subPhoneNo': this.user.subPhoneNo.slice(5, 12),
                                'operator': this.user.subPhoneNo.slice(2, 5),
                                'phoneNo': '' })
  }

  updateProfile(req : any){
    delete req.subPhoneNo;
    delete req.operator; 
    this.loading = true;
    this.userService.walletUpdate(req).subscribe(data => {
      this.loading = false;
      if(data.data){
        localStorage.setItem('user', JSON.stringify(data.data));
        this.user = JSON.parse(localStorage.getItem('user'));
        this.toastService.showToast('success', 'ÉXITO', 'INFORMACIÓN MODIFICADA.')
        this.profileForm.reset();
        this.isSubmitted = false;
        this.showForm = false;
      }
    }, error => {
      this.loading = false;
      if(error.error.code){
        this.toastService.showToast('danger', 'ERROR', error.error.msg)
      }
    })
  }

  deleteFingerprint(){
    this.nativeStorage.clear();
    this.finger = false;
    this.toastService.showToast('success', 'ÉXITO', 'TU HUELLA HA SIDO ELIMINADA.');
  }

  preafiliar(){
    this.loading = true;
    var req = {"trace_id":this.user['trace_id'],"BankCode":"0174","Status":0,"type":"natural"}
    this.userService.wallletPreAfiliation(req).subscribe(data =>{
      this.loading = false;
      //AQUI HAY QUE ACTUALIZAR EL LOCAL STORAGE Y CAMBIAR LOS BOTONES
      this.user['affiliation'] = [req]
      localStorage.setItem('user', JSON.stringify(this.user));
      this.user = JSON.parse(localStorage.getItem('user'));
      this.toastService.showToast('success', 'ÉXITO', 'PREAFILIACION EXITOSA')

      this.showPreafiliar = false
      this.showAfiliar = true
      this.statusA =  "PREAFILIADO"

    },error =>{
      this.loading = false;
      if(error.error.code){
        this.toastService.showToast('danger', 'ERROR', error.error.msg)
      }
    })
  }
}
