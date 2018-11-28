import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
/**
 * Generated class for the NoticesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notices',
  templateUrl: 'notices.html',
})
export class NoticesPage {
  public notices: any;
  public noticesArray: Array<{subject: any, date: any, description: any}>;
  public noticeIds: any;
  noticesTab: string = "recentNotices";
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
    let url = "http://digitalsociety.pythonanywhere.com/getNotices?societyId=1";
    let tempnotice;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.notices = data;
      this.noticeIds = Object.keys(data);
      console.log(this.noticeIds.length);
      this.noticesArray = [];
      for(let i = 0; i < this.noticeIds.length; i++){
        tempnotice = Object.getOwnPropertyDescriptor(this.notices,this.noticeIds[i]).value;
        this.noticesArray.push({
          subject: tempnotice.subject,
          date: tempnotice.date,
          description: tempnotice.description
        });
      }
      //console.log(key);
      //console.log(Object.getOwnPropertyDescriptor(this.notices,key).value);
      console.log(this.noticesArray);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticesPage');
  }

}
