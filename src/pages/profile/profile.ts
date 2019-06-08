import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';
import { SocietiesProvider } from '../../providers/society/society';

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

  constructor(public societiesProvider: SocietiesProvider, public userProvider: UserProvider, public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private loadingCtrl: LoadingController) {
  
  }

  ionViewDidEnter(){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    // this.storage.get('Info').then( (res) =>{ 

    this.clientName = this.userProvider['userData']['name'];
    this.clientEmail = this.userProvider['userData']['member_email'];
    this.clientPhone = this.userProvider['userData']['phone'];
    //this.clientAddress = res.address2;
    this.clientFlat = this.userProvider['userData']['unit_no'];
    
    // this.storage.get('societyId').then((res) => {
    // let societyId = this.societiesProvider['societyData']['society_id'];
    // let tempKey = Object.keys(societysnapshot.val())[0];
    // let societyInfo = Object.getOwnPropertyDescriptor(societysnapshot.val(),tempKey).value;
    this.societyName = this.societiesProvider['societyData']['display_name'];
    this.societyAddress = this.societiesProvider['societyData']['address'];
   
    // });
    // });
    this.loader.dismiss();  
  }

}
