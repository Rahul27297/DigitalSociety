import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Keyboard } from '@ionic-native/keyboard';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SimplyBookClient } from '../../providers/simplybook/client';
import { AlertController } from 'ionic-angular'
import { ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoadingController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import * as firebase from 'firebase';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocietiesProvider } from '../../providers/society/society';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public societyName: any;
  public societyLogo: any;
  private login: FormGroup;
  public appmodule: SimplyBookClient;
  private clientinfo: any;
  private loader: any;
  private societyId: any;
  private societyInfo: any;
  private societyReady: boolean;
  constructor(public societiesProvider: SocietiesProvider, public splashScreen: SplashScreen, public navCtrl: NavController, private toastCtrl: ToastController, private storage: Storage, public http: Http, private formBuilder: FormBuilder, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private keyboard: Keyboard) {
    this.societyReady = false;
    this.societyName = "gully";
    this.login = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.appmodule = new SimplyBookClient(storage);
  }

  ionViewDidLoad() {
    this.splashScreen.hide();
  }

  displayLoader() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present().then(() => {
      this.loginForm();
      this.loader.dismiss();
    })
  }


  loginForm() {
    let userName = this.login.value.userName;
    let password = this.login.value.password;
    let invalidLoginCredsMessage = "Either the Email or Password provided was incorrect. Please try again.";
    firebase.auth().signInWithEmailAndPassword(userName, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
    //let serverErrorMessage = "Unable to connect to Server. Please try later";
    // this.clientinfo = this.appmodule.client.getClientInfoByLoginPassword(userName, password);
    // if (this.clientinfo.code == -32065) {
    //   this.loader.dismiss();
    //   this.invalidLoginAlert(invalidLoginCredsMessage);
    // }
    // else {//login considered successful --> Server can be down, this case has not been considered here
    //   firebase.database().ref('members').orderByChild('member_email').equalTo("" + userName).once('value',(snapshot) => {
    //     let childsnapshotkey = Object.keys(snapshot.val())[0];
    //     // console.log(childsnapshotkey, userName);
    //     this.societyId = Object.getOwnPropertyDescriptor(snapshot.val(), childsnapshotkey).value;
    //     this.societyId = this.societyId.society_id;
    //     this.storage.set("societyId", this.societyId);
    //     this.storage.set('userKey', childsnapshotkey);
    //     this.storage.set('emailId', userName);
    //     console.log("Society Id: " + this.societyId);
    //     firebase.database().ref('societies').orderByChild('society_id').equalTo("" + this.societyId).on('value', (societysnapshot) => {




    //       console.log("Information Stored");
    //       let tempKey = Object.keys(societysnapshot.val())[0];
    //       this.societyInfo = Object.getOwnPropertyDescriptor(societysnapshot.val(),tempKey).value;
    //       console.log(this.societyInfo);

    //       this.societiesProvider.init(this.societyInfo);

    //       this.storage.set('Password', password);
    //       this.loader.dismiss();
    //       this.toastCtrl.create({
    //         message: 'Login Successful',
    //         duration: 2000,
    //         position: 'bottom'
    //       }).present();
    //       this.storage.set('Info', this.clientinfo);
    //       this.navCtrl.setRoot(HomePage, {
    //         societyInfo: this.societyInfo,
    //         societyId: this.societyId
    //       });


    //     });
    //   });
    // }
    /*else{
      this.invalidLoginAlert(serverErrorMessage);
    }*/
  }

  invalidLoginAlert(alertMessage: any) {
    let invalidLoginAlert = this.alertCtrl.create({
      title: 'Login Failure',
      subTitle: alertMessage,
      buttons: ['Dismiss'],
    });
    invalidLoginAlert.present();
  }

  loadSignupPage() {
    this.navCtrl.push(SignupPage);
  }


}
