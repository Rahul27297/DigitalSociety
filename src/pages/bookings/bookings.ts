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

@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
  private simplyBookClient: SimplyBookClient;
  private clientId: any;
  private clientHash: any;
  private loader:any;
  private upComingBookings: any;
  private pastBookings: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private storage: Storage) {
    console.log("cons");
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    let filter = {
      "upcoming_only": "false",
      "confirmed_only": "false"
    };
    this.loader.present();
    this.storage.get('Info').then((res) => {
      console.log(res);
      this.clientId = res.id;
      this.clientHash = res.client_hash;
      console.log(this.clientId+this.clientHash);
    let sign = Md5.hashStr(this.clientId + this.clientHash + "2e92bf595e6cb07b56510c057026bf16e9d2ff5d741acaeb7e287e92116047d0");
    this.simplyBookClient = new SimplyBookClient();
    console.log(sign);
    this.upComingBookings = this.simplyBookClient.client.getClientBookings(parseInt(this.clientId),sign,filter);
    console.log(this.upComingBookings);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingsPage');
    
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter BookingsPage');
  }

}
