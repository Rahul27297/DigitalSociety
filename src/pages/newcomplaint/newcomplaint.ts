import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, DateTime } from 'ionic-angular';
import { LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http } from '@angular/http'; 
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

/**
 * Generated class for the NewcomplaintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newcomplaint',
  templateUrl: 'newcomplaint.html',
})
export class NewcomplaintPage {

  private complaintForm: FormGroup;
  public imageURI: any;
  private complaintTitle: any;
  private complaintDescription: any;
  private complaintLocation: any;
  private selectedPhoto: any;
  private firebaseComplaintStorageRed: any;
  private complaintKey: any;
  private imageObtained: any = false;
  private societyId: any;
  private clientName: any;
  private clientEmail: any;
  private societyInfo: any;
  private loader: any;
  private hasAttachment: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private formBuilder: FormBuilder, private actionSheetCtrl: ActionSheetController, private http: Http, private storage: Storage, private alertCtrl: AlertController, private httpClient: HttpClient) {
    this.complaintKey = firebase.database().ref("complaints").push().key
    this.http = http;
    this.hasAttachment = false;
    this.societyId = navParams.get('societyId');
    this.societyInfo = navParams.get('societyInfo');
    this.complaintForm = this.formBuilder.group({
      complaintTitle: ['', Validators.required],
      complaintDescription: ['', Validators.required],
      complaintLocation: ['', Validators.required]
    });
    this.storage.get('Info').then((val) => {
      this.clientEmail = val.email;
      this.clientName = val.name;
    });
    this.firebaseComplaintStorageRed = firebase.storage().ref();
  }
  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: "Select Image Using: ",
      buttons :[
        {
          text: "Camera",
          handler :() => {
            this.getImage("Camera");
          }
        },
        {
          text: "Gallery",
          handler :() => {
            this.getImage("Gallery");
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

  getImage(imageSource: string) {
    let sourceType: any;
    if(imageSource === "Camera"){
      sourceType = this.camera.PictureSourceType.CAMERA;
    }
    else if(imageSource === "Gallery"){
      sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    }
    const options: CameraOptions = {
      quality: 80,
      targetHeight: 800,
      targetWidth: 800,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType
    }

    this.camera.getPicture(options).then((imageData) => {
      this.loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      this.loader.present();
      this.selectedPhoto = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);
      this.upload();
    }, (err) => {
      console.log(err);
    });
  }

  dataURItoBlob(dataURI) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  };

  upload() {
    let uploadTask: firebase.storage.UploadTask;
    if (this.selectedPhoto) {
      uploadTask = this.firebaseComplaintStorageRed.child("complaints/" + this.societyId + "/" + this.complaintKey)
        .put(this.selectedPhoto);
      uploadTask.then(snapshot => {
        this.firebaseComplaintStorageRed.child("complaints/" + this.societyId + "/" +this.complaintKey).getDownloadURL().then((val) => {
          this.imageURI = val;
          this.hasAttachment = true;
          this.imageObtained = true;
          this.loader.dismiss();
        });
      }, () => {
        console.log("error");
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewcomplaintPage');
  }

  registerComplaint() {
    this.loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    this.loader.present();
    this.complaintTitle = this.complaintForm.value.complaintTitle;
    this.complaintDescription = this.complaintForm.value.complaintDescription;
    this.complaintLocation = this.complaintForm.value.complaintLocation;

    // console.log({
    //   "attachment_url": "/complaints/" + this.societyId + "/" + this.complaintKey,
    //   "complainant_email": this.clientEmail,
    //   "complainant_name": this.clientName,
    //   "complaint_description": this.complaintDescription,
    //   "complaint_title": this.complaintTitle,
    //   "is_attachment_present": this.hasAttachment,
    //   "location": this.complaintLocation,
    //   "society_id": this.societyId,
    //   "time": new Date()
    // })

    let download_url = null;
    let attachment_url = null;


    console.log(download_url, attachment_url)
    if(this.imageURI != undefined) {
      console.log(download_url, attachment_url)
      download_url = this.imageURI;
      attachment_url = "/complaints/" + this.societyId + "/" + this.complaintKey
    }
    // converting epoch time to seconds

    let currentTime = Math.floor(((new Date).getTime())/1000);
    
    firebase.database().ref('complaints/' + this.complaintKey).set({
        "attachment_url": attachment_url,
        "complainant_email": this.clientEmail,
        "complainant_name": this.clientName,
        "complaint_description": this.complaintDescription,
        "complaint_title": this.complaintTitle,
        "download_url": download_url,
        "is_attachment_present": this.hasAttachment,
        "location": this.complaintLocation,
        "society_id": this.societyId,
        "time": currentTime
    });


    // let url = "https://upgraded-server.herokuapp.com/postComplaint?society_id=" + this.societyId +"&complainant_email=" + this.clientEmail + "&complainant_name=" + this.clientName +"&complaint_title=" + this.complaintTitle + "&complaint_description=" + this.complaintDescription + "&time=" + new Date() + "&date" + new Date() +"&location=" + this.complaintLocation + "&is_attachment_present=" + this.hasAttachment + "&admin_email_ids="+ this.societyInfo.society.admin_email_ids + "&complaint_key=" + this.complaintKey;


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log(this.societyId, typeof(this.societyId))
    this.httpClient.post("https://gentle-savannah-47625.herokuapp.com/complaints/send",
    {
      "attachment_url": "/complaints/" + this.societyId + "/" + this.complaintKey,
      "complainant_email": this.clientEmail,
      "complaint_key": this.complaintKey,
      "complainant_name": this.clientName,
      "complaint_description": this.complaintDescription,
      "complaint_title": this.complaintTitle,
      "download_url": this.imageURI,
      "is_attachment_present": this.hasAttachment,
      "location": this.complaintLocation,
      "society_id": this.societyId,
      "time": new Date(),
      "admin_email_ids": this.societyInfo.society.admin_email_ids
    },
    httpOptions     // Headers
    )
    .subscribe(data  => {
      console.log("POST Request is successful ", data);
      this.loader.dismiss();
      this.alertCtrl.create({
        title: "Complaint successfully registered!",
        buttons: ['Ok']
      }).present().then(() => {
        this.navCtrl.popToRoot();
      });
    },
    error  => {
      console.log("Error", error);
    }

    );
    
    // this.http.get(url).map(res => res.json()).subscribe((val) => {
    //   if(val.data.flag && val.data.complaint_state === "COM"){
    //     this.loader.dismiss();
    //     this.alertCtrl.create({
    //       title: "Complaint successfully registered!",
    //       buttons: ['Ok']
    //     }).present().then(() => {
    //       this.navCtrl.popToRoot();
    //     });
    //   }
    //   else{
    //     this.loader.dismiss();
    //   }
    // });

  } 

  removeImage(){
    this.hasAttachment = false;
    this.loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    this.loader.present();
    let imagePathInStorage = "/complaints/" + this.societyId + "/" + this.complaintKey;
    let imageRef = this.firebaseComplaintStorageRed.child(imagePathInStorage);
    imageRef.delete().then(function(){
      console.log("file deleted successfully")
    }).catch(function(error){
      console.log(error)
    })
    this.loader.dismiss();
    this.imageObtained = false;
  }

}
