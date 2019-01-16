import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { NoticesPage } from '../notices/notices'
import { FacilitiesPage } from '../facilities/facilities';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { ComplaintsPage } from '../complaints/complaints';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private loadingCtrl: LoadingController) {
    let url = "https://digitalsociety.pythonanywhere.com/getDownloadUrlImages";
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.noticesImage = data.download_url_notices_logo;
      this.facilitiesImage = data.download_url_facilities_logo;
      this.complaintsImage = "https://www.pexels.com/photo/brown-paper-lot-on-floor-near-brown-wall-1411426/";
      console.log(this.noticesImage);
      this.loader.dismiss();
    });
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter HomePage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  facilities(){
    this.navCtrl.push(FacilitiesPage);
  }

  notices(){
    this.navCtrl.push(NoticesPage);
  }

  complaints(){
    this.navCtrl.push(ComplaintsPage);
  }

}
