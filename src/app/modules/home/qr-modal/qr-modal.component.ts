import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user/user.service';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.scss'],
})



export class QrModalComponent implements OnInit {

  user : any;
  scannedUserInfo = new User();
  qrID : string = "";

  constructor(private modalControler: ModalController,
    private userService: UserService) { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('user'));
    this.qrID = this.user.idUser;
  }


  close() {
    this.modalControler.dismiss({
      'dismissed': true
    });
  }



}
