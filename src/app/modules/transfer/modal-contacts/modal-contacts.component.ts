import { Component, OnInit } from '@angular/core';
import { faTimes, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user/user.service';
import { Friend } from 'src/app/core/models/friend';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-modal-contacts',
  templateUrl: './modal-contacts.component.html',
  styleUrls: ['./modal-contacts.component.scss'],
})
export class ModalContactsComponent implements OnInit {

  friends : Friend;
  listContacts = Array<Friend>();
  loading : boolean = false;
  faTimes = faTimes;
  faSpinner = faSpinner;
  faUser = faUser;

  constructor(private modalController : ModalController,
              private userService : UserService,
              private toastService : ToastService) { }

  ngOnInit() {
    this.walletContacts();
  }

  async myDismiss(item : any) { 
    await this.modalController.dismiss(item);
  }

  close(){
    this.myDismiss({});
  }

  walletContacts(){
    this.loading = true;
    let req = { 'type' : 'diemo_transfer' };
    this.userService.walletContacts(req).subscribe(data => {
      this.loading = false;
      if(data.data){
        this.listContacts = data.data;
      }
    }, error => {
      this.loading = false;
    })
  }

  deleteContact(friend : Friend){
    this.loading = true;
    let req = { 'friend_number': friend.friend_number };
    this.userService.walletContactDelete(req).subscribe(data => {
        this.loading = false;
        if(data.data){
          this.walletContacts();
          this.toastService.showToast('success', 'ÉXITO', data.data);
        }
    }, error => {
        this.loading = false;
    })
  }

}
