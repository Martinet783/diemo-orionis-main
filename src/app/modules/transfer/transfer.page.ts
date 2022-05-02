import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ModalContactsComponent } from './modal-contacts/modal-contacts.component';
import { sha256 } from 'js-sha256';
import { Transfer } from 'src/app/core/models/transfer';
import { UserService } from 'src/app/core/services/user/user.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Router } from '@angular/router';
import { faHeart, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Friend } from 'src/app/core/models/friend';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HomeRefreshService } from 'src/app/core/services/home-refresh/home-refresh.service';
import { Transactions } from 'src/app/core/models/transactions';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.page.html',
  styleUrls: ['./transfer.page.scss'],
})
export class TransferPage implements OnInit {

  transferForm: FormGroup;
  isSubmitted: boolean;
  loading: boolean = false;
  add_contact: boolean = false;
  error: boolean = false;
  showDetails: boolean = false;
  favorites: boolean = false;
  finger : boolean = false;
  transaction: Transactions;
  pin: string;
  faHeart = faHeart;
  faQrcode = faQrcode;
  scannedUserInfo : any;
  monto : string;
  divisa : string;

  constructor(private formBuilder: FormBuilder,
    public modalController: ModalController,
    public userService: UserService,
    private router: Router,
    public toastService: ToastService,
    private barcodeScanner: BarcodeScanner,
    private homeRefreshService: HomeRefreshService,
    private nativeStorage : NativeStorage) { }

  ngOnInit() {
    this.loading = false;
    this.transferForm = this.formBuilder.group({
      alias: [''],
      operator: ['', Validators.required],
      phoneNo: [''],
      subNo: ['', [Validators.required, Validators.maxLength(7), Validators.minLength(7), Validators.pattern('[0-9]*')]],
      amount: ['', [Validators.required, Validators.pattern('[0-9]*?.*?[0-9]*')]],
      pin: ['',  [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]{4}$')]],
      add_friend: [false]
    })

    // this.getUserInfo();
    this.nativeStorage.getItem('faio')
    .then(data => {
        if(data){
          this.finger = true;
        }
      },error => console.error(error));

    
    this.divisa = localStorage.getItem('divisa');
    this.montoType();
  }

  montoType(){
    if(this.divisa == "bs"){
      this.monto = "Monto en Bolivares"
    }
    else if(this.divisa == "usd"){
      this.monto = "Monto en Dólares"
    }
    else if(this.divisa == "eur"){
      this.monto = "Monto en Euros"
    }
  }

  onKeyQty($event, qty) {
    let regexp = new RegExp(/^[0-9]{1,7}$/);
    let valid_qty = regexp.test(String(this.transferForm.get("subNo"))) ? qty : '';
  }

  onKeyPin(pinForm){  
    let pin = String(pinForm.value);
    let regexp = new RegExp(/^[0-9]{1,4}$/);
    let valid_pin = regexp.test(pin) ? pin : pin.slice(0, 4);
    this.f.pin.setValue(valid_pin);
  }

  onKeyPhone(subNoForm){
    let subNo = String(subNoForm.value);
    let regexp = new RegExp(/^[0-9]{1,7}$/);
    let valid_subNo = regexp.test(subNo) ? subNo : subNo.slice(0, 7);
    this.f.subNo.setValue(valid_subNo);
  }

  change_toggle(event) {
    this.add_contact = event.detail.checked;
    if(this.add_contact){
      this.transferForm.get('alias').setValidators([Validators.required]);
    }
    else {
      this.transferForm.get('alias').setValidators(null);
    }
    this.transferForm.get('alias').updateValueAndValidity();
  }

  get f() { return this.transferForm.controls; }

  submitForm() {
    if (this.error) {
      this.pin = this.transferForm.controls.pin.value;
    }
    this.isSubmitted = true;
    if (this.transferForm.invalid) { return; }

    let transfer: Transfer = { ...this.transferForm.value };
    transfer.pin = sha256(String(transfer.pin));
    transfer.phoneNo = "58" + transfer.operator + transfer.subNo;
    if (transfer.add_friend) { transfer.type = "diemo_transfer"; }
    this.walletTransfer(transfer);
  }

  walletTransfer(transfer: Transfer) {
    this.loading = true;
    this.userService.walletTransfer(transfer).subscribe(data => {
      this.loading = false;
      this.isSubmitted = false;
      this.transferForm.reset();
      if (data.data) {
        this.toastService.showToast("success", "ÉXITO", "TRANSFERENCIA REALIZADA.", 4000);
        this.homeRefreshService.setRefresh(true);
        this.detailsTransaction(data.data);
      }
    }, error => {
      this.error = true;
      this.loading = false;
      if (error.error.code) {
        this.toastService.showToast("danger", "ERROR", error.error.msg, 4000);
      }
    })
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalContactsComponent,
      cssClass: 'my-custom-class'
    });

    this.close(modal)

    return await modal.present();
  }

  async close(modal: any) {
    const { data } = await modal.onWillDismiss();
    if (data.user) {
      this.favorites = true;
      let friend = new Friend(data.user);
      this.transferForm.controls.operator.setValue(friend.getPrefijo());
      this.transferForm.controls.subNo.setValue(friend.getPhone());
    }
  }


  getUserInfo(id) {
    this.scannedUserInfo = this.userService.getScannedUserInfo({"documento" : id}).subscribe(data => {
      this.transferForm.controls.operator.setValue(data.data.operator);
      var phonePattern = data.data.subPhoneNo.substring(5,12);
      this.transferForm.controls.subNo.setValue(phonePattern);
    });
  }

  scanQR() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.getUserInfo(barcodeData.text);

    }).catch(err => { 
      // console.log('Error', err); 
    });
  }

  showContacts() { this.presentModal(); }

  detailsTransaction(item: Transactions) {
    this.showDetails = true;
    this.transaction = item;
  }

  outputDetailsTransaction($event) {
    this.showDetails = false;
    this.homeRefreshService.setRefresh(true);
    this.router.navigateByUrl("home");
  }
}
