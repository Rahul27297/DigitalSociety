import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SimplyBookClient } from '../../providers/simplybook/client';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {  Md5 } from 'ts-md5/dist/md5'
/**
 * Generated class for the BookingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 /*
 class to fetch the bookings of the client.
 */

@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
  private simplyBookClient: SimplyBookClient; //simplybook client api has been used
  private clientId: any; //used to calculate md5
  private clientHash: any; //used to calculate md5
  private loader:any; //UI loader
  private upComingBookings: any; //this object isused to store client's upcoming bookings
  private pastBookings: any;  //this object isused to store client's past bookings
  private md5: Md5;
  private bookingsFilter: any; //used for fetching different type of booking
  private upcomingBookingsFilter: any;
  private pastBookingsFilter: any;
  private eventList: any;
  private BookingsArray: Array<{service_name: string, date: string, first_char: any}>;
  private upcomingBookingsCount: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private storage: Storage) {
    this.md5 = new Md5();
    this.upcomingBookingsFilter = {
      upcoming_only: true   
    };
    this.pastBookingsFilter = {
      upcoming_only: false   
    };
    this.storage.get('Info').then((res) => {
      this.clientId = res.id;
      this.clientHash = res.client_hash;
      this.md5.appendStr(this.clientId).appendStr(this.clientHash).appendStr("2e92bf595e6cb07b56510c057026bf16e9d2ff5d741acaeb7e287e92116047d0");
      let sign = this.md5.end();
      this.simplyBookClient = new SimplyBookClient();
      this.upComingBookings = this.simplyBookClient.client.getClientBookings(parseInt(this.clientId),sign,this.upcomingBookingsFilter); 
      this.pastBookings = this.simplyBookClient.client.getClientBookings(parseInt(this.clientId),sign,this.pastBookingsFilter);
      this.eventList = this.simplyBookClient.client.getEventList();
      console.log(this.pastBookings);
      console.log(this.eventList);
      console.log(this.pastBookings.length);
      this.BookingsArray = [];
      let service_name:any, date: any, service_id;
      for(let i = this.pastBookings.length - 1 ; i >= 0 ; i=i-1){
        service_id = this.pastBookings[i].service_id;
        console.log(service_id);
        service_name = this.eventList[service_id].name;
        date = this.pastBookings[i].start_date + " " + this.pastBookings[i].start_time;
        this.BookingsArray.push({
          service_name: service_name,
          date: date,
          first_char: service_name.charAt(1)
        });
      }
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingsPage');
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter BookingsPage');
    this.loader.dismiss();
  }

}
