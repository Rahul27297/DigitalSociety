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
  private startDate: any;
  private facilityTnC: any;
  private tnc:any;
  private simplyBookClient: SimplyBookClient;
  private clientData: any;
  private clientPassword: any;
  private societyId: any;
  private loader: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,  private storage: Storage, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.simplyBookClient = new SimplyBookClient();
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
        this.facilityId = this.navParams.get("facilityId");
        this.facilityName = this.navParams.get("facilityName");
        this.startTime = this.navParams.get("startTime");
        this.startDate = this.navParams.get("startDate");
        this.societyId = this.navParams.get('societyId');
        this.facilityTnC = this.navParams.get("facilityTnC");
        this.loader.dismiss();
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
            booking = this.simplyBookClient.client.book(this.facilityId, this.societyId, this.startDate, this.startTime, this.clientData, null , 1);
            console.log(this.simplyBookClient.client.book(this.facilityId, 1, this.startDate, this.startTime, this.clientData, null , 1));
            console.log(Object.keys(booking));
            if(Object.keys(booking)[1] == "bookings"){
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
