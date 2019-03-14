import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { SimplyBookClient } from "../../providers/simplybook/client";
import { BfacilityPage } from '../bfacility/bfacility';
import { LoadingController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,  private storage: Storage, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    // this.simplyBookClient = new SimplyBookClient();
    this.tnc = false;
    this.storage.get('Password').then((val) => {
      this.clientPassword = val;
      this.storage.get('Info').then((val) => {
        this.clientName = val.name;
        this.clientPhone = val.phone;
        this.clientEmail = val.email;
        this.clientData = {
          client_login: this.clientEmail,
          client_password: this.clientPassword
        };
        console.log(navParams)
        this.facilityId = this.navParams.get("facilityId");
        this.serviceProviderIdInSimplybook = this.navParams.get("serviceProviderIdInSimplybook");
        this.facilityName = this.navParams.get("facilityName");
        this.startTime = this.navParams.get("startTime");
        this.endTime = this.navParams.get('endTime');
        console.log(this.endTime);
        this.startDate = this.navParams.get("startDate");
        this.societyId = this.navParams.get('societyId');
        this.facilityTnC = this.navParams.get("facilityTnC");
        console.log(this.facilityId, this.serviceProviderIdInSimplybook);
        this.storage.get('clientToken').then((val) => {
          console.log(val)
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
      });
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
    console.log("displayTnc");
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
    console.log("here");
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
              booking = this.newClient.book(this.facilityId, this.serviceProviderIdInSimplybook, this.startDate, this.startTime, this.clientData, null , 1);
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
            // console.log(this.simplyBookClient.client.book(this.facilityId, 1, this.startDate, this.startTime, this.clientData, null , 1));

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
