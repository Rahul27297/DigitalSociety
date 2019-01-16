import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController, ToastController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';
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
  public imageURI:SafeResourceUrl;;
  public imageFileName:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private transfer: FileTransfer, private camera: Camera, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private formBuilder: FormBuilder, private sanitizer: DomSanitizer) {
    this.complaintForm = this.formBuilder.group({
      complaintTitle: ['', Validators.required],
      complaintDescription: ['', Validators.required],
      complaintLocation: ['', Validators.required]
    });
  }

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
  
    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + imageData);
    }, (err) => {
      console.log(err);
    });
  }

  uploadFile() {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
  
    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: '1',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    }
  
    fileTransfer.upload(this.imageURI.toString(), 'https://sleepy-river-43449.herokuapp.com/', options)
      .then((data) => {
      console.log(data+" Uploaded Successfully");
      this.imageFileName = "https://sleepy-river-43449.herokuapp.com/1.jpg"
      loader.dismiss();
     // this.presentToast("Image uploaded successfully");
     console.log("Success");
    }, (err) => {
      console.log(err);
      loader.dismiss();
      //this.presentToast(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewcomplaintPage');
  }

}
