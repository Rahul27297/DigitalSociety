import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { NoticePage } from '../notice/notice';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
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
  public noticesArray: Array<{ subject: any, date: any, content: any, searchid: any }>;
  public noticesArchivedArray: Array<{ subject: any, date: any, searchid: any }>;
  public noticeIds: any;
  private loader: any;
  noticesTab: string = "recentNotices";
  private societyId: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private loadingCtrl: LoadingController, private storage: Storage) {
    this.societyId = navParams.get('societyId').toString();
  }

  setup() {
    let date = new Date();
    console.log(date);
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let hr = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    console.log(day + " " + month + " " + year + "  " + hr);
    let epoch_recent = (new Date(year, month-1, day, hr, min, sec).getTime() )/ 1000;
    let epoch_archived = (new Date(year, month-3, day, hr, min, sec).getTime() )/ 1000;
    console.log(epoch_recent);
    console.log(epoch_archived);
    firebase.database().ref('notices').orderByChild('society_id').equalTo(this.societyId).on('value', (snapshot) => {
      this.recentNotices = [];
      this.archivedNotices = [];
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.val().epoch_time > epoch_recent) {
          this.recentNotices.push({
            notice_title: childSnapshot.val().notice_title,
            date: childSnapshot.val().date + " " + childSnapshot.val().time,
            notice_description: childSnapshot.val().notice_description,
            notice_url: childSnapshot.val().notice_url,
            searchid: childSnapshot.key
          });
        }
        else if(childSnapshot.val().epoch_time < epoch_recent && childSnapshot.val().epoch_time > epoch_archived) {
          this.archivedNotices.push({
            notice_title: childSnapshot.val().notice_title,
            date: childSnapshot.val().date + " " + childSnapshot.val().time,
            notice_description: childSnapshot.val().notice_description,
            notice_url: childSnapshot.val().notice_url,
            searchid: childSnapshot.key
          });
        }
      });
      console.log(this.archivedNotices);
    });

    /*let url = "https://upgraded-server.herokuapp.com/getNoticesBySocietyId?society_id=" + this.societyId;
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
      }
    });*/

  }

  ionViewDidLoad() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    setTimeout(() => {
      this.setup();
      this.loader.dismiss();
    }, 50);
  }

  ionViewDidEnter() {
  }

  getNotice(notice, type) {
    if (type === "archived") {
      this.navCtrl.push(NoticePage, {
        notice: notice
      });
    }
    else if (type === "recent") {
      this.navCtrl.push(NoticePage, {
        notice: notice
      });
    }
  }

}
