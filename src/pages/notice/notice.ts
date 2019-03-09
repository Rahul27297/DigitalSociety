import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, ActionSheetController } from 'ionic-angular';
import { Http } from '@angular/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ToastController, AlertController, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { Platform } from 'ionic-angular';

/**
 * Generated class for the NoticePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notice',
  templateUrl: 'notice.html',
})
export class NoticePage {
  private noticeKey: any;
  private notice: any;
  private subject: any;
  private description: any;
  private date: any;
  private attachment: any;
  private hasAttachment: boolean;
  private downloadLoader: any;
  constructor(private platform: Platform, private iab: InAppBrowser,private actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public http: Http,private file: File, private transfer: FileTransfer, private toastCtrl: ToastController, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.notice = this.navParams.get('notice');
    console.log(this.notice);
      this.subject = this.notice.notice_title;
      this.date = this.notice.date;
      this.description = this.notice.notice_description;
      this.attachment = this.notice.notice_url;
      this.hasAttachment = this.notice.has_attachment;
      this.downloadLoader = this.loadingCtrl.create({
        content: "Downloading attachment"
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticePage');

 
  }

  downloadAttachment(){
    /*let attach;
    let url = this.attachment;
    console.log(url);
      const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(url,this.file.externalRootDirectory + '/Download/'+ "Noticefile.pdf").then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.toastCtrl.create({
        message: "Download Successful",
        duration: 2000
      }).present();
    }, (error) => {

    });
    */
   if(this.platform.is('ios')) {
    const actionSheet = this.actionSheetCtrl.create({
      title: "View Notice",
      buttons :[
        {
          text: "Open in Browser",
          handler :() => {
            firebase.storage().ref(this.attachment).getDownloadURL().then((url) => {
              const options: InAppBrowserOptions = {
                zoom: "yes"
              }
              const browser = this.iab.create(url, '_self', options);          
             });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
   }
   else {
    this.alertCtrl.create({
      subTitle: "Do you want to download attachment for this notice?",
      buttons: [
        {
          text: "Yes",
          handler: () => {
            this.downloadLoader.present();
            firebase.storage().ref(this.attachment).getDownloadURL().then((url) => {
              const fileTransfer: FileTransferObject = this.transfer.create();
              fileTransfer.download(url,this.file.externalRootDirectory + '/Download/'+ "Notice" + this.notice.searchid+".pdf").then((entry) => {
                console.log('download complete: ' + entry.toURL());
                this.downloadLoader.dismiss();
                this.alertCtrl.create({
                  title: "Download successful!",
                  buttons: [
                    {
                      text: "Dismiss",
                      role: "Dismiss"
                    }
                  ]
                }).present();
              }, (error) => {
                console.log(error, url);
                this.alertCtrl.create({
                  title: "Download error, try after some time",
                  buttons: [
                    {
                      text: "Dismiss",
                      role: "Dismiss"
                    }
                  ]
                }).present();
              });
             });
          }
        },
        {
          text: "No",
          role: "cancel"
        }
      ]
    }).present();
   }
    

   
  }

}
