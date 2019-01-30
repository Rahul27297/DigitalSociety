import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewcomplaintPage } from '../newcomplaint/newcomplaint';

/**
 * Generated class for the ComplaintsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complaints',
  templateUrl: 'complaints.html',
})
export class ComplaintsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintsPage');
  }

  newComplaint(){
    this.navCtrl.push(NewcomplaintPage);
  }

}
