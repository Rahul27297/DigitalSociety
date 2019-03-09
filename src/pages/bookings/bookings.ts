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
declare var JSONRpcClient;

@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
  // private simplyBookClient: SimplyBookClient; //simplybook client api has been used
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
  private BookingsArray: any;
  private upcomingBookingsCount: any;
  private newClient: any;
  private clientEmail: any;
  public facilityNames: any[] = [];
  private noOfUpcomingBookings: any = -1;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private storage: Storage) {
    // this.simplyBookClient = new SimplyBookClient(storage);

    // this.md5 = new Md5();
    // this.upcomingBookingsFilter = {
    //   upcoming_only: true   
    // };
    // this.pastBookingsFilter = {
    //   upcoming_only: false   
    // };
    // this.storage.get('Info').then((res) => {
    //   this.clientId = res.id;
    //   this.clientHash = res.client_hash;
    //   this.md5.appendStr(this.clientId).appendStr(this.clientHash).appendStr("2e92bf595e6cb07b56510c057026bf16e9d2ff5d741acaeb7e287e92116047d0");
    //   let sign = this.md5.end();
    //   this.simplyBookClient = new SimplyBookClient();
    //   console.log(this.simplyBookClient.admin.getBookings({
    //     "client_id": "4"
    //   }), this.clientId)
    //   this.upComingBookings = this.simplyBookClient.client.getClientBookings(parseInt(this.clientId),sign,this.upcomingBookingsFilter); 
    //   this.pastBookings = this.simplyBookClient.client.getClientBookings(parseInt(this.clientId),sign,this.pastBookingsFilter);
    //   this.eventList = this.simplyBookClient.client.getEventList();
    //   console.log(this.pastBookings);
    //   console.log(this.eventList);
    //   console.log(this.pastBookings.length);
    //   this.BookingsArray = [];
    //   let service_name:any, date: any, service_id;
    //   for(let i = this.pastBookings.length - 1 ; i >= 0 ; i=i-1){
    //     service_id = this.pastBookings[i].service_id;
    //     console.log(service_id);
    //     service_name = this.eventList[service_id].name;
    //     date = this.pastBookings[i].start_date + " " + this.pastBookings[i].start_time;
    //     this.BookingsArray.push({
    //       service_name: service_name,
    //       date: date,
    //       first_char: service_name.charAt(1)
    //     });
    //   }
    // });

    // this.storage.get('Info').then((res) => {
    //   this.clientId = res.id;
    //   console.log(this.simplyBookClient.admin.getBookings({
    //     "client_id": "1"
    //   }), this.clientId)    
    // })
  }

  ionViewWillEnter() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad BookingsPage');
    this.storage.get('adminToken').then((val) => {
			console.log(val)
			this.newClient = new JSONRpcClient({
        'url': 'https://user-api.simplybook.me' + '/admin/',
        'headers': {
            'X-Company-Login': 'gully',
            'X-User-Token': val
        },
        'onerror': function (error) {}
    });

    this.storage.get('Info').then((val) => {
      this.clientEmail = val.email;
      console.log(this.clientEmail)
      let currentDateAndTime = new Date();
      console.log(currentDateAndTime)
      let dd = currentDateAndTime.getDate();
      let mm = currentDateAndTime.getMonth()+1;
      let yyyy = currentDateAndTime.getFullYear();
      let HH = currentDateAndTime.getHours();
      let MM = currentDateAndTime.getMinutes();
      let SS = currentDateAndTime.getSeconds();
      let BookingsTemp = this.newClient.getBookings({
        "client_email": this.clientEmail,
        "date_from": yyyy+"-"+mm+"-"+dd,
        // "time_from": HH+":"+MM+":"+SS,    // will fetch all bookings after this particular time, even for future dates 
        "order": "date_start_asc"
      })
      this.noOfUpcomingBookings = BookingsTemp.length;
      for(let i = 0; i < BookingsTemp.length; i++){
        let eventName = BookingsTemp[i].event;
        let eventDateAndTime = BookingsTemp[i].start_date;
        console.log(eventName, eventDateAndTime)
        let nameAfterRemovingSocietyId = (eventName.split("-"))[0];
        this.facilityNames.push({
          "nameAfterRemovingSocietyId": nameAfterRemovingSocietyId,
          "eventDateAndTime": eventDateAndTime
        })
      }
      console.log("hiii")
      console.log(this.facilityNames)
      this.BookingsArray = BookingsTemp;
      console.log(dd,mm,yyyy,HH,MM,SS)
      // console.log(this.newClient.getBookings({
      //   "client_email": this.clientEmail,
      //   "date_from": yyyy+"-"+mm+"-"+dd,
      //   // "time_from": HH+":"+MM+":"+SS,    // will fetch all bookings after this particular time, even for future dates 
      //   "order": "date_start_asc"
      //   })
      // )
    })

    this.loader.dismiss();
    
		});
  }


}
