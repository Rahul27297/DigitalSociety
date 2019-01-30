import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { NoticePage } from '../notice/notice';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
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
  public recentNotices: any;
  public archivedNotices: any;
  public noticesArray: Array<{ subject: any, date: any, searchid: any }>;
  public noticesArchivedArray: Array<{ subject: any, date: any, searchid: any }>;
  public noticeIds: any;
  private loader: any;
  noticesTab: string = "recentNotices";
  private societyId: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private loadingCtrl: LoadingController, private storage: Storage) {
    this.societyId = navParams.get('societyId');

  }

  setup() {
    let url = "https://upgraded-server.herokuapp.com/getNoticesBySocietyId?society_id=" + this.societyId;
    let tempnotice;
    let buffer;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      buffer = Object.getOwnPropertyDescriptor(data, "data").value;
      let success = Object.getOwnPropertyDescriptor(buffer, "flag").value;
      if (success) {
        this.recentNotices = Object.getOwnPropertyDescriptor(buffer, "recent").value;

        this.noticesArray = [];
        for (let i = 0; i < this.recentNotices.length; i++) {
          tempnotice = this.recentNotices[i];
          this.noticesArray.push({
            subject: tempnotice.notice_title,
            date: tempnotice.date + " " + tempnotice.time,
            searchid: i
          });
        }
        this.noticesArchivedArray = [];
        this.archivedNotices = Object.getOwnPropertyDescriptor(buffer, "archived").value;
        for (let i = 0; i < this.archivedNotices.length; i++) {
          tempnotice = this.archivedNotices[i];
          this.noticesArchivedArray.push({
            subject: tempnotice.notice_title,
            date: tempnotice.date + " " + tempnotice.time,
            searchid: i
          });
        }
        console.log(this.archivedNotices);
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

  ionViewDidEnter() {
    this.setup();
    this.loader.dismiss();
  }

  getNotice(searchkey, type) {
    if (type === "archived") {
      this.navCtrl.push(NoticePage, {
        notice: this.archivedNotices[searchkey]
      });
    }
    else if (type === "recent") {
      this.navCtrl.push(NoticePage, {
        notice: this.recentNotices[searchkey]
      });
    }
  }

}
