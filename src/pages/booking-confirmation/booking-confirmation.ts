import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { SimplyBookClient } from "../../providers/simplybook/client";
import { BfacilityPage } from '../bfacility/bfacility';
import { LoadingController } from 'ionic-angular';
import { BookingProvider } from '../../providers/booking/booking';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the BookingConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var JSONRpcClient;

@IonicPage()
@Component({
  selector: 'page-booking-confirmation',
  templateUrl: 'booking-confirmation.html',
})
export class BookingConfirmationPage {

  private clientName: any;
  private clientPhone: any;
  private facilityId: any;
  private clientEmail: any;
  private facilityName: any;
  private startTime: any;
  private endTime: any;
  private startDate: any;
  private facilityTnC: any;
  private tnc:any;
  private simplyBookClient: SimplyBookClient;
  private clientData: any;
  private clientPassword: any;
  private societyId: any;
  private loader: any;
  private serviceProviderIdInSimplybook: any;
  public newClient: any;
  public simplyBookDateFormat: any;
  private monthMap : any = {
    "1": "Jan",
    "2": "Feb",
    "3": "Mar",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "Aug",
    "9": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec"
  };
  constructor(public userProvider: UserProvider, public bookingProvider: BookingProvider, public navCtrl: NavController, public navParams: NavParams,  private storage: Storage, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    // this.simplyBookClient = new SimplyBookClient();
    this.tnc = false;
    this.storage.get('Password').then((val) => {
      this.clientPassword = val;
      // this.storage.get('Info').then((val) => {
        this.clientName = this.userProvider['userData']['name'];
        this.clientPhone = this.userProvider['userData']['phone'];
        this.clientEmail = this.userProvider['userData']['member_email'];
        this.clientData = {
          client_login: this.clientEmail,
          client_password: this.clientPassword
        };
        // console.log((this.bookingProvider)
        // console.log((navParams)
        // console.log(()

        this.facilityId = this.bookingProvider['bookingData']['facilityId'];
        this.simplyBookDateFormat = this.bookingProvider['bookingData']['simplyBookDateFormat'];
        this.serviceProviderIdInSimplybook = this.bookingProvider['bookingData']['serviceProviderIdInSimplybook']
        this.facilityName = this.bookingProvider['bookingData']['facilityName']
        this.facilityTnC = this.bookingProvider['bookingData']['facilityTnC']
        this.startTime = this.bookingProvider['bookingData']['startTime']
        this.endTime = this.bookingProvider['bookingData']['endTime']
        let dateArray = this.bookingProvider['bookingData']['startDate'].split("-")
        this.startDate = this.monthMap[dateArray[1]] + " " + dateArray[2] + ", " + dateArray[0];
        this.societyId = this.bookingProvider['bookingData']['societyId']
        // this.simplyBookDateFormat = this.navParams.get('simplyBookDateFormat');
        // this.serviceProviderIdInSimplybook = this.navParams.get("serviceProviderIdInSimplybook");
        // this.facilityName = this.navParams.get("facilityName");
        // this.startTime = this.navParams.get("startTime");
        // this.endTime = this.navParams.get('endTime');
        // // console.log((this.endTime);
        // let dateArray = this.navParams.get("startDate").split("-");
        // this.startDate = this.monthMap[dateArray[1]] + " " + dateArray[2] + ", " + dateArray[0];
        // this.societyId = this.navParams.get('societyId');
        // this.facilityTnC = this.navParams.get("facilityTnC");

    



        // console.log((this.facilityId, this.serviceProviderIdInSimplybook);
        this.storage.get('clientToken').then((val) => {
          // console.log((val)
          this.newClient = new JSONRpcClient({
            'url': 'https://user-api.simplybook.me',
            'headers': {
              'X-Company-Login': 'gully',
              'X-Token': val
            },
            'onerror': function (error) {}
          });
          // this.endTime = this.newClient.calculateEndTime(this.startDate + " " + this.startTime, this.facilityId, this.serviceProviderIdInSimplybook);
          // this.endTime = this.endTime.split(" ")[1]

          this.loader.dismiss();
        });
      // });
    });
  }

  ionViewDidLoad() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  tncCheckBox(){
    if(this.tnc == false){
      this.tnc = true;
    }
    else{
      this.tnc = false;
    }
  }

  displayTnC(){
    // console.log(("displayTnc");
    this.alertCtrl.create({
      title: "Terms & Conditions",
      subTitle: this.facilityTnC,
      buttons:[{
        text: "Dismiss",
        role: "cancel"
      }]
    }).present();
  }

  confirmBooking(){
    let booking;
    // console.log(("here");
    if(this.tnc == true){
      this.alertCtrl.create({
        title: "Confirm Booking?",
        buttons:[{
          text: "Yes",
          handler: () => {
            this.loader = this.loadingCtrl.create({
              content: "Please wait..."
            });
            this.loader.present().then(() => {
              // console.log((this.startTime+":00")
              booking = this.newClient.book(this.facilityId, this.serviceProviderIdInSimplybook, this.simplyBookDateFormat, this.startTime+":00", this.clientData, null , 1);
              if(Object.keys(booking)[1] == "bookings"){
                this.loader.dismiss();
                this.alertCtrl.create({
                  title: "Booking Successful!",
                  buttons: [{
                    text: "Dismiss",
                    handler: () => {
                      this.navCtrl.popToRoot();
                    }
                }]
                }).present();
              }else{
                this.loader.dismiss();
                this.alertCtrl.create({
                  title: "Booking Failure!",
                  buttons: [{
                    text: "Dismiss",
                    handler: () => {
                      this.navCtrl.popTo(BfacilityPage);
                    }
                }]
                }).present();
              }		
            });
            // // console.log((this.simplyBookClient.client.book(this.facilityId, 1, this.startDate, this.startTime, this.clientData, null , 1));

          }
        },
        {
          text: "No",
          role: "cancel" 
        }]
      }).present();
    }
    else{
      this.alertCtrl.create({
        subTitle: "Please accept Terms & Conditions",
        buttons: ["Dismiss"]
      }).present();
    }
  }

  cancelBooking(){
    this.alertCtrl.create({
      title: "Cancel Booking?",
      buttons:[{
        text: "Yes",
        handler: () => {
          this.navCtrl.popToRoot();
        }
      },
      {
        text: "No",
        role: "cancel" 
      }]
    }).present();
  }

}
