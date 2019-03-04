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
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private loadingCtrl: LoadingController, private storage: Storage, private simplyBookClient: SimplyBookClient) {
    this.societyId = this.navParams.get('societyId');
    this.societyInfo = this.navParams.get('societyInfo');
    this.societyName = this.societyInfo.display_name;
    console.log(this.societyId);
    console.log(this.societyName);
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
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    //this.loader.present();
  }

  facilities() {
    this.navCtrl.push(FacilitiesPage, {
      societyId: this.societyId,
      societyInfo: this.societyInfo
    });
  }

  notices() {
    this.navCtrl.push(NoticesPage, {
      societyId: this.societyId
    });
  }

  complaints() {
    this.navCtrl.push(NewcomplaintPage, {
      societyId: this.societyId,
      societyInfo: this.societyInfo
    });
  }

}
