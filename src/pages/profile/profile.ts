import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  private clientInfo: any;
  private clientName: any;
  private clientPhone: any;
  private clientEmail: any;
  private clientAddress: any;
  private clientFlat: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.storage.get('Info').then( (res) =>{ 
      this.clientName = res.name;
      this.clientEmail = res.email;
      this.clientPhone = res.phone;
      this.clientAddress = res.address2;
      this.clientFlat = res.address1;
      console.log(this.clientInfo);
    });
  }

  ionViewDidEnter(){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    
  }

}
