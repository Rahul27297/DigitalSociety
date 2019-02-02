import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { NoticesPage } from '../notices/notices'
import { FacilitiesPage } from '../facilities/facilities';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { NewcomplaintPage } from '../newcomplaint/newcomplaint';
import { Storage } from '@ionic/storage';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private loadingCtrl: LoadingController, private storage: Storage) {
    this.societyId = this.navParams.get('societyId');
    this.societyInfo = this.navParams.get('societyInfo');
    this.societyName = this.societyInfo.society.display_name;
    this.setUpHomeScreen();
  }

  setUpHomeScreen() {
    if (this.societyInfo != null) {
      this.hasFacilities = this.societyInfo.society.facilities.is_feature_available;
      this.hasComplaints = this.societyInfo.society.complaints.is_feature_available;
      this.hasNotices = this.societyInfo.society.notices.is_feature_available;
      if (this.hasFacilities) {
        this.facilitiesImage = this.societyInfo.download_urls.facilities_image_download_url;
      }
      if (this.hasComplaints) {
        this.complaintsImage = this.societyInfo.download_urls.complaints_image_download_url;
      }
      if (this.hasNotices) {
        this.noticesImage = this.societyInfo.download_urls.notices_image_download_url;
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
      societyId: this.societyId
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
