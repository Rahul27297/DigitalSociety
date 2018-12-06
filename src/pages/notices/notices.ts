import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { NoticePage } from '../notice/notice'; 
import { LoadingController } from 'ionic-angular';
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
  public noticesArchivedArray: Array<{subject: any, date: any, searchid: any}>;
  public noticeIds: any;
  private loader: any;
  noticesTab: string = "recentNotices";
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private loadingCtrl: LoadingController) {
    
  }

  setup(){
    let url = "http://digitalsociety.pythonanywhere.com/getRecentNotices?societyId=1";
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
    url = "http://digitalsociety.pythonanywhere.com/getArchivedNotices?societyId=1";
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.notices = data;
      console.log(this.notices);
      this.noticesArchivedArray = [];
      this.noticeIds = Object.keys(this.notices);
      console.log(this.noticeIds);
      for(let i = 0; i < this.notices.length; i++){
        tempnotice = Object.getOwnPropertyDescriptor(this.notices,this.noticeIds[i]).value;
        tempnotice = Object.getOwnPropertyDescriptor(tempnotice,Object.keys(tempnotice)[0]).value;
        console.log(tempnotice);
        this.noticesArchivedArray.push({
          subject: tempnotice.subject,
          date: tempnotice.date,
          searchid: tempnotice.key_for_search
        });
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticesPage');
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  ionViewDidEnter(){
    this.setup();
    this.loader.dismiss();
  }

  getNotice(searchkey){
    this.navCtrl.push(NoticePage,{
      searchid: searchkey
    });
  }

}
