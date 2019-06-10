import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { NoticesPage } from '../notices/notices';
import { FacilitiesPage } from '../facilities/facilities';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { NewcomplaintPage } from '../newcomplaint/newcomplaint';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { SimplyBookClient } from '../../providers/simplybook/client';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { SocietiesProvider } from '../../providers/society/society';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  private facilitiesImage: any;
  private noticesImage: any;
  private complaintsImage: any;
  private loader: any;
  private societyId: any;
  private societyInfo: any;
  private hasFacilities: boolean;
  private hasNotices: boolean;
  private hasComplaints: boolean;
  private societyName: any;
  private userKey: any;
  constructor(public userProvider: UserProvider, public societiesProvider: SocietiesProvider, private fcm: FCM, public splashScreen: SplashScreen, public navCtrl: NavController, public navParams: NavParams, private http: Http, private loadingCtrl: LoadingController, private storage: Storage) {
    this.societyId = this.societiesProvider['societyData']['society_id'];
    this.societyInfo = this.societiesProvider['societyData'];
    this.societyName = this.societyInfo['display_name'];
    // this.userKey = this.navParams.get('userKey');
    // console.log((this.societyId);
    // console.log((this.societyName);

    // notification token register code
    // this.storage.get('emailId').then((val1) => {
      // console.log((val1);
      // this.storage.get('userKey').then((val2) => {

      // if(this.societyId != null && val1 != null && val2 != null){
        // console.log(("here23")
    console.log(this.userProvider)
    this.fcm.getToken().then(token => {
      firebase.database().ref('tokens'+'/'+this.userProvider['userKey']).set({
        "member_email": this.userProvider['userData']['member_email'],
        "society_id": this.societyId.toString(),  // please test this
        "token": token
      })
    });

    // this.fcm.onNotification().subscribe(data => {
    //   if(data.wasTapped){
    //     // console.log(("Received in background");
    //   } else {
    //     // console.log(("Received in foreground");
    //   };
    // });

    // this.fcm.onTokenRefresh().subscribe(token => {
    //   firebase.database().ref('tokens'+'/'+this.userProvider['userKey']).set({
    //     "member_email": this.userProvider['userData']['member_email'],
    //     "society_id": this.societyId.toString(),  // please test this
    //     "token": token
    //   })
    // });
  

    this.setUpHomeScreen();
  
}

  setUpHomeScreen() {
    
    let storageRef = firebase.storage();
    if (this.societyInfo != null) {
      this.hasFacilities = this.societyInfo.facilities.is_feature_available;
      this.hasComplaints = this.societyInfo.complaints.is_feature_available;
      this.hasNotices = this.societyInfo.notices.is_feature_available;
      
      if (this.hasFacilities) {
        if (this.societyInfo.facilities.has_custom_image) {
          this.facilitiesImage = this.societyInfo.facilities.custom_image_url;
        }
        else {
          this.facilitiesImage = this.societyInfo.facilities.default_image_url;
        }
      }

      if (this.hasComplaints) {
        if (this.societyInfo.complaints.has_custom_image) {
          this.complaintsImage = this.societyInfo.complaints.custom_image_url;
        }
        else {
          this.complaintsImage = this.societyInfo.complaints.default_image_url;
        }
      }

      if (this.hasNotices) {
        if (this.societyInfo.notices.has_custom_image) {
          this.noticesImage = this.societyInfo.notices.custom_image_url;
        }
        else {
          this.noticesImage = this.societyInfo.notices.default_image_url;
        }
      }
    }
  }

  ionViewDidEnter() {
  }

  ionViewDidLoad() {
    this.splashScreen.hide();
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    //this.loader.present();
  }

  facilities() {
    this.navCtrl.push(FacilitiesPage, {
      // societyId: this.societyId,
      // societyInfo: this.societyInfo
    });
  }

  notices() {
    this.navCtrl.push(NoticesPage, {
      // societyId: this.societyId
    });
  }

  complaints() {
    this.navCtrl.push(NewcomplaintPage, {
      // societyId: this.societyId,
      // societyInfo: this.societyInfo
    });
  }

}
