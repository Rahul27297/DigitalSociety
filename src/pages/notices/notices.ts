import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { NoticePage } from '../notice/notice'; 
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
  public noticesArray: Array<{subject: any, date: any, searchid: any}>;
  public noticeIds: any;
  noticesTab: string = "recentNotices";
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
    let url = "http://digitalsociety.pythonanywhere.com/getNotices?societyId=1";
    let tempnotice;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.notices = data;
      console.log(this.notices);
      this.noticesArray = [];
      this.noticeIds = Object.keys(this.notices);
      console.log(this.noticeIds);
      for(let i = 0; i < this.notices.length; i++){
        tempnotice = Object.getOwnPropertyDescriptor(this.notices,this.noticeIds[i]).value;
        tempnotice = Object.getOwnPropertyDescriptor(tempnotice,Object.keys(tempnotice)[0]).value;
        console.log(tempnotice);
        this.noticesArray.push({
          subject: tempnotice.subject,
          date: tempnotice.date,
          searchid: tempnotice.key_for_search
        });
      }
      //console.log(key);
      //console.log(Object.getOwnPropertyDescriptor(this.notices,key).value);
      //console.log(this.noticesArray);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticesPage');
  }

  getNotice(searchkey){
    this.navCtrl.push(NoticePage,{
      searchid: searchkey
    });
  }

}
