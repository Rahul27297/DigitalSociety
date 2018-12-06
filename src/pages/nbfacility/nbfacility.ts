import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { SimplyBookClient } from '../../providers/simplybook/client';
/**
 * Generated class for the NbfacilityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nbfacility',
  templateUrl: 'nbfacility.html',
})
export class NbfacilityPage {
  private loading: any;
  private simplyBookClient: SimplyBookClient;
  private facilityInfo: any;
  private facilityName: any;
  private facilityDescription: any;
  private facilityImage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    console.log("1");
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loading.present();
    this.facilityInfo = this.navParams.get('facility');
    this.facilityName = this.facilityInfo.name;
    this.facilityImage = this.facilityInfo.url;
    this.facilityDescription = this.facilityInfo.description;
  }

  ionViewDidEnter(){
    console.log("2");
    this.loading.dismiss();
  }

}
