import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SimplyBookClient } from '../../providers/simplybook/client';
import { LoadingController } from 'ionic-angular';
import { NbfacilityPage } from '../nbfacility/nbfacility';
import  { CalendarPage } from '../calendar/calendar';
import { BfacilityPage } from '../bfacility/bfacility';
import { Http } from '@angular/http';
import * as firebase from 'firebase';
import { BookingProvider } from '../../providers/booking/booking';
import { SocietiesProvider } from '../../providers/society/society';

/**
 * Generated class for the FacilitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-facilities',
  templateUrl: 'facilities.html',
})
export class FacilitiesPage {

  private simplyBookClient: SimplyBookClient;
  //private facilitiesArray: Array<{}>
  private fac: any;
  private loading: any;
  private facilityids: any;
  private facilitiesArray: any;
  private societyId :any;
  private societyInfo: any;
  private firebaseDatabase: any;
  constructor(public societiesProvider: SocietiesProvider, public bookingProvider: BookingProvider, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public http: Http) {
    
  }

  getEventList(){
    // this.simplyBookClient = new SimplyBookClient();
    this.societyId = null;
    this.societyInfo = null;
    this.societyId = this.societiesProvider['societyData']['society_id'];
    this.societyInfo = this.societiesProvider['societyData'];
    // console.log((this.societyId);
    // console.log((this.societyInfo);
    // console.log((this.societyInfo.facilities.list)
    this.facilitiesArray = [];
    for (let i = 0; i < this.societyInfo.facilities.list.length; i=i+1) {
      if (this.societyInfo.facilities.list[i] != null) {
        this.facilitiesArray.push(this.societyInfo.facilities.list[i]);
      }
    }
    // console.log((this.facilitiesArray);

  }

  // ionViewDidLoad() {
  //   // console.log(('ionViewDidLoad FacilitiesPage');
  //   this.loading = this.loadingCtrl.create({
  //     content:'Please wait...'
  //   });
  //   this.loading.present();
  //   setTimeout(() => {
  //     this.getEventList();
  //     this.loading.dismiss();   
  //   }, 100);
  // }

  ionViewWillEnter() {
    this.loading = this.loadingCtrl.create({
			content: "Please wait..."
		});
		this.loading.present();
  }

  ionViewDidEnter(){
    this.getEventList();
    this.loading.dismiss();
    // console.log(('ionViewDidLoad FacilitiesPag111e');
    //this.getEventList();
  }

  facilitySelected(item){
    this.bookingProvider['facilityInfo'] = item;
    if(!item.is_bookable){
      this.navCtrl.push(NbfacilityPage,{
        facility: item,
        societyId: this.societyId
      });
    }
    else{
      this.navCtrl.push(BfacilityPage,{
        facility: item,
        societyId: this.societyId
      });
    }
  }

}
