import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';

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
  private clientName: any;
  private clientPhone: any;
  private clientEmail: any;
  private clientFlat: any;
  private societyName: any;
  private societyAddress: any;
  private loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private loadingCtrl: LoadingController) {
  
  }

  ionViewDidEnter(){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    this.storage.get('Info').then( (res) =>{ 

      this.clientName = res.name;
      this.clientEmail = res.email;
      this.clientPhone = res.phone;
      //this.clientAddress = res.address2;
      this.clientFlat = res.address1;
      
      this.storage.get('societyId').then((res) => {
        let societyId = res;
        firebase.database().ref('societies').orderByChild('society_id').equalTo("" + societyId).on('value', (societysnapshot) => {
          console.log("Information Stored");
            let tempKey = Object.keys(societysnapshot.val())[0];
            let societyInfo = Object.getOwnPropertyDescriptor(societysnapshot.val(),tempKey).value;
            this.societyName = societyInfo.display_name;
            this.societyAddress = societyInfo.address;
        });
      });
    });
    this.loader.dismiss();  
  }

}
