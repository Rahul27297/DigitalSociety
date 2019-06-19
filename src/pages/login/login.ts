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
import { SignupPage2 } from '../signup2/signup2';
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
    // this.appmodule = new SimplyBookClient(storage);
  }

  ionViewDidLoad() {
    this.splashScreen.hide();
  }


  displayLoader() {
    // loader # 1
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present().then(() => {
      let userName = this.login.value.userName;
      let password = this.login.value.password;
      let invalidLoginCredsMessage = "Either the Email or Password provided was incorrect. Please try again.";
      firebase.auth().signInWithEmailAndPassword(userName, password)
      .then((user) => {
        // loader # 1 close and navigate to home page from app.ts
        this.loader.dismiss();
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // console.log((error)
  
        // loader # 1 close
        this.loader.dismiss();
  
        this.invalidLoginAlert(invalidLoginCredsMessage);
        // ...
      });
    })
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
    this.navCtrl.push(SignupPage2);
  }


}
