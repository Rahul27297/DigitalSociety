import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { NoticePage } from '../notice/notice';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { SocietiesProvider } from '../../providers/society/society';

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
  public recentNoticesLength: any = -1;
  public archivedNoticesLength : any = -1;
  public archivedNotices: any;
  public noticesArray: Array<{ subject: any, date: any, content: any, searchid: any }>;
  public noticesArchivedArray: Array<{ subject: any, date: any, searchid: any }>;
  public noticeIds: any;
  private loader: any;
  noticesTab: string = "recentNotices";
  private societyId: any;
  private monthMap : any = {
    "1": "Jan",
    "2": "Feb",
    "3": "Mar",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "Aug",
    "9": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec"
  }
  constructor(public societiesProvider: SocietiesProvider, public navCtrl: NavController, public navParams: NavParams, private http: Http, private loadingCtrl: LoadingController, private storage: Storage) {
    this.societyId = this.societiesProvider['societyData']['society_id']
    // console.log((this.monthMap)
  }

  // function to sort notices by epoch_time in DESC order
  predicateBy(prop) {
    return function(a,b){
       if( a[prop] < b[prop]){
           return 1;
       }else if( a[prop] > b[prop] ){
           return -1;
       }
       return 0;
    }

 }

  setup() {
    let date = new Date();
    // console.log((date);
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let hr = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    // console.log((day + " " + month + " " + year + "  " + hr);
    let epoch_recent = (new Date(year, month-1, day, hr, min, sec).getTime() )/ 1000;
    let epoch_archived = (new Date(year, month-3, day, hr, min, sec).getTime() )/ 1000;
    // console.log((epoch_recent);
    // console.log((epoch_archived);
    firebase.database().ref('notices').orderByChild('society_id').equalTo(this.societyId).on('value', (snapshot) => {
      this.recentNotices = [];
      this.archivedNotices = [];
      console.log(snapshot.val());
      snapshot.forEach((childSnapshot) => {
        let d = new Date(0);
        d.setUTCSeconds(childSnapshot.val().epoch_time)
        let month = this.monthMap[d.getMonth()+1];
        let date = d.getDate();
        let year = d.getFullYear();
        let hh = d.getHours();
        let mm = d.getMinutes();
        console.log(mm, typeof(mm))
        if(hh < 10) {
          hh = "0" + hh;
        }
        if(mm < 10) {
          mm = "0" + mm;
        }
        console.log(hh, mm)
        // console.log((childSnapshot.val(),d)
        if(childSnapshot.val().epoch_time > epoch_recent) {
          this.recentNotices.unshift({
            notice_title: childSnapshot.val().notice_title,
            date: month + " " + date + ", " + year + " " + hh + ":" + mm,
            notice_description: childSnapshot.val().notice_description,
            notice_url: childSnapshot.val().notice_url,
            searchid: childSnapshot.key,
            has_attachment: childSnapshot.val().has_attachment,
            epoch_time: childSnapshot.val().epoch_time
          });
        }
        else if(childSnapshot.val().epoch_time < epoch_recent && childSnapshot.val().epoch_time > epoch_archived) {
          this.archivedNotices.unshift({
            notice_title: childSnapshot.val().notice_title,
            date: month + " " + date + ", " + year + " " + hh + ":" + mm,
            notice_description: childSnapshot.val().notice_description,
            notice_url: childSnapshot.val().notice_url,
            searchid: childSnapshot.key,
            has_attachment: childSnapshot.val().has_attachment,
            epoch_time: childSnapshot.val().epoch_time
          });
        }
      });
      
      this.recentNotices.sort(this.predicateBy("epoch_time"))
      this.archivedNotices.sort(this.predicateBy("epoch_time"))

      this.recentNoticesLength = this.recentNotices.length;
      this.archivedNoticesLength = this.archivedNotices.length;
      // console.log((this.archivedNoticesLength);
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

  }

  ionViewWillEnter() {
    // console.log(("Enter");
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present().then(() => {
      this.setup();
      this.loader.dismiss();
    });
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
