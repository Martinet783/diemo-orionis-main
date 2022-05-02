import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faHeart, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Transactions } from 'src/app/core/models/transactions';
import { sha256 } from 'js-sha256';
import { UserService } from 'src/app/core/services/user/user.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { HomeRefreshService } from 'src/app/core/services/home-refresh/home-refresh.service';
import { ModalController } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'form-operations',
  templateUrl: './form-operations.component.html',
  styleUrls: ['./form-operations.component.scss'],
})
export class FormOperationsComponent implements OnInit {

  @Input()type_operation : number;
  @Output() emitForm = new EventEmitter<any>();
  transferForm : FormGroup;
  isSubmitted : boolean;
  loading : boolean = false;
  transaction : Transactions;
  faSpinner = faSpinner;
  faTimes = faTimes;

  constructor(private formBuilder : FormBuilder,
              private userService : UserService,
              private toastService : ToastService,
              private homeRefreshService : HomeRefreshService,
              private modalController : ModalController,
              private device: Device
              ) { }

  get f(){ return this.transferForm.controls; }

  ngOnInit() {
    if(this.type_operation == 1){
      this.transferForm = this.formBuilder.group({
        amount : ['', Validators.required],
        pin : ['', [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]{4}$')]],
        time:['',Validators.required]
      })
    }else{
      this.transferForm = this.formBuilder.group({
        amount : ['', Validators.required],
        pin : ['', [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]{4}$')]]
      })
    }
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.transferForm.invalid){return ;}
    let formValue = this.transferForm.value; 

    if(formValue.amount == 0){
      this.toastService.showToast('danger', 'ERROR', 'EL MONTO DEBE SER MAYOR A 0');
      return
    }

    formValue.pin = sha256(formValue.pin);
    formValue.boxOperationType = this.type_operation;
    formValue.device_id = this.device.uuid
    this.walletOfflineBalanceUpdate(formValue);
  }

  walletOfflineBalanceUpdate(req : any){
    this.loading = true;
    this.userService.walletOfflineBalanceUpdate(req).subscribe(data => {
      this.loading = false;
      if(data.data){
        //CHILD COMPONENT VARIABLES
        var r = {"result":true,'offline_txs':data.data}
        this.transferForm.reset();
        // this.formOperations.isSubmitted = false;
        // this.showForm = false;
        this.dissmiss(r);
        this.homeRefreshService.setRefresh(true);
        
        //CHILD COMPONENT VARIABLES

        if(this.type_operation == 1){
          this.toastService.showToast('success', 'ÉXITO', 'RECARGA REALIZADA.');
        }else if(this.type_operation == 2){
          this.toastService.showToast('success', 'ÉXITO', 'RETIRO REALIZADO.');
        }
      }else if(data.code){
        this.toastService.showToast('danger', 'ERROR', data.msg);
      }
    }, error => {
      this.loading = false;
      if(error.error){
        this.toastService.showToast('danger', 'ERROR', error.error.msg);
      }
    })
  }

  dissmiss(req){
    this.modalController.dismiss(req);
  }

}
