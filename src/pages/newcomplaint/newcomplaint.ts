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
import { BackgroundMode } from '@ionic-native/background-mode';
import { SocietiesProvider } from '../../providers/society/society';
import { UserProvider } from '../../providers/user/user';

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

  private complaintData = {
    "attachment_url": "",
    "complainant_email": "",
    "complainant_name": "",
    "complaint_description": "",
    "complaint_title": "",
    "download_url": "",
    "is_attachment_present": false,
    "location": "",
    "society_id": "",
    "time": -1,
    "unit_no": ""  
  }

  private complaintForm: FormGroup;
  public imageURI: any;
  private selectedPhoto: any;
  private firebaseComplaintStorageRed: any;
  private complaintKey: any;
  private imageObtained: any = false;
  private societyId: any;
  private societyInfo: any;
  private loader: any;
  private hasAttachment: boolean;
  constructor(public userProvider: UserProvider, public societyProvider: SocietiesProvider, public backgroundMode: BackgroundMode, public navCtrl: NavController, public navParams: NavParams, public camera: Camera, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private formBuilder: FormBuilder, private actionSheetCtrl: ActionSheetController, private http: Http, private storage: Storage, private alertCtrl: AlertController, private httpClient: HttpClient) {
    this.complaintKey = firebase.database().ref("complaints").push().key
    this.http = http;
    this.hasAttachment = false;
    this.societyId = this.societyProvider['societyData']['society_id'];
    this.societyInfo = this.societyProvider['societyData'];
    console.log(this.societyProvider)
    this.complaintForm = this.formBuilder.group({
      complaintTitle: ['', Validators.required],
      complaintDescription: ['', Validators.required],
      complaintLocation: ['', Validators.required]
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
            // console.log(('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

 

  getImage(imageSource: string) {
    let sourceType: any;

    this.backgroundMode.enable();
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
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present().then(() => {
      this.camera.getPicture(options).then((imageData) => {

        this.selectedPhoto = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);
        this.upload();

      }, (err) => {
        this.loader.dismiss();
        // console.log(("ehrer", err);
      });

    })
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
          this.backgroundMode.disable();
        });
      }, () => {
        // console.log(("error");
      });
    }
  }

  registerComplaint() {
    // console.log((this.clientFlatNo)
    this.loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    this.loader.present();
    let download_url = null;
    let attachment_url = null;


    // console.log((download_url, attachment_url)
    if(this.imageURI != undefined) {
      // console.log((download_url, attachment_url)
      download_url = this.imageURI;
      attachment_url = "/complaints/" + this.societyId + "/" + this.complaintKey
    }
    // converting epoch time to seconds

    let currentTime = Math.floor(((new Date).getTime())/1000);
    // console.log((this.clientEmail);

    this.complaintData['attachment_url'] = attachment_url;
    this.complaintData['complaint_description'] = this.complaintForm.value.complaintDescription;
    this.complaintData['complainant_email'] = this.userProvider['userData']['member_email'];
    this.complaintData['complainant_name'] = this.userProvider['userData']['name'];
    this.complaintData['complaint_title'] = this.complaintForm.value.complaintTitle;
    this.complaintData['download_url'] = download_url;
    this.complaintData['is_attachment_present'] = this.hasAttachment;
    this.complaintData['location'] = this.complaintForm.value.complaintLocation;
    this.complaintData['society_id'] = this.societyProvider['societyData']['society_id'];
    this.complaintData['time'] = currentTime;
    this.complaintData['unit_no'] = this.userProvider['userData']['unit_no'];
    this.complaintData['state'] = this.societyProvider['societyData']['complaints']['workflow']['initial_state'];

    


    firebase.database().ref('complaints/' + this.complaintKey).set(this.complaintData).then(() => {
      this.loader.dismiss();
      this.alertCtrl.create({
        title: "Complaint successfully registered!",
        buttons: ['Ok']
      }).present().then(() => {
        this.navCtrl.popToRoot();
      });
    });


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
      // console.log(("file deleted successfully")
    }).catch(function(error){
      // console.log((error)
    })
    this.loader.dismiss();
    this.imageObtained = false;
    this.complaintKey = firebase.database().ref("complaints").push().key

  }

}
