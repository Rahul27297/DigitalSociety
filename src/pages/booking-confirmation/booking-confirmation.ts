import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { SimplyBookClient } from "../../providers/simplybook/client";
import { BfacilityPage } from '../bfacility/bfacility';
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
  private tnc:any;
  private simplyBookClient: SimplyBookClient;
  private clientData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,  private storage: Storage, private alertCtrl: AlertController) {
    this.simplyBookClient = new SimplyBookClient();
    this.tnc = false;
    this.storage.get('Info').then((val) => {
      this.clientName = val.name;
      this.clientPhone = val.phone;
      this.clientEmail = val.email;
      this.clientData = {
        name: this.clientName,
        email: this.clientEmail,
        phone: this.clientPhone
      }
      console.log(this.clientData);
    });
    this.facilityId = this.navParams.get("facilityId");
    this.facilityName = this.navParams.get("facilityName");
    this.startTime = this.navParams.get("startTime");
    this.startDate = this.navParams.get("startDate");
    console.log(this.startDate);
    console.log(this.startTime);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingConfirmationPage');
  }

  tncCheckBox(){
    if(this.tnc == false){
      this.tnc = true;
    }
    else{
      this.tnc = false;
    }
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
            booking = this.simplyBookClient.client.book(this.facilityId, 1, this.startDate, this.startTime, this.clientData, null , 1);
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
