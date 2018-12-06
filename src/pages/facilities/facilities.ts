import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SimplyBookClient } from '../../providers/simplybook/client';
import { LoadingController } from 'ionic-angular';
import { NbfacilityPage } from '../nbfacility/nbfacility';
import  { CalendarPage } from '../calendar/calendar';
import { BfacilityPage } from '../bfacility/bfacility';
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
  private facilitiesArray: Array<{name: String, bookable: any, url: String, description: String, id: any}>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    
  }

  getEventList(){
    this.simplyBookClient = new SimplyBookClient();
    this.fac = this.simplyBookClient.client.getEventList();
    console.log(this.fac);
    this.facilityids = Object.keys(this.fac);
    this.facilitiesArray = [];
    let tempfacility, facName, bookable;
    for(let i = 0; i < this.facilityids.length; i++){
      tempfacility = Object.getOwnPropertyDescriptor(this.fac,this.facilityids[i]).value;
      console.log(tempfacility);
      facName = tempfacility.name;
      facName = facName.substring(1,facName.length);
      if(tempfacility.name[0] == "0"){ bookable = '0';}
      else{bookable = '1'}
      this.facilitiesArray.push({
        name: facName,
        bookable: bookable,
        url: "https://simplybook.me" + tempfacility.picture_path,
        description: tempfacility.description,
        id: tempfacility.id
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FacilitiesPage');
    this.loading = this.loadingCtrl.create({
      content:'Please wait...'
    });
    this.loading.present();
  }

  ionViewDidEnter(){
    console.log('ionViewDidLoad FacilitiesPag111e');
    this.getEventList();
    this.loading.dismiss();
  }

  facilitySelected(item){
    if(item.bookable == "0"){
      this.navCtrl.push(NbfacilityPage,{
        facility: item
      });
    }
    else if(item.bookable == "1"){
      this.navCtrl.push(BfacilityPage,{
        facility: item
      });
    }
  }

}
