import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,private file: File, private transfer: FileTransfer, private toastCtrl: ToastController) {
    this.notice = this.navParams.get('notice');
    console.log(this.notice);
      this.subject = this.notice.notice_title;
      this.date = this.notice.date + " " + this.notice.time;
      this.description = this.notice.notice_description;
      this.attachment = this.notice.notice_url;
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticePage');
  }

  downloadAttachment(){
    /*let attach;
    let url = "http://digitalsociety.pythonanywhere.com/getDownloadUrl?societyId=1&attachment="+this.attachment;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      attach = data.download_url;
      console.log(attach);
      const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(attach,this.file.externalRootDirectory + '/Download/'+ "Noticefile.pdf").then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.toastCtrl.create({
        message: "Download Successful",
        duration: 2000
      }).present();
    }, (error) => {

    });
    });*/
    
  }

}
