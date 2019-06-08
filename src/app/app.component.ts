import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavParams} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BookingsPage } from '../pages/bookings/bookings';
import { ProfilePage } from '../pages/profile/profile';
import { LogoutPage } from '../pages/logout/logout';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { NoNetworkPage } from '../pages/no-network/no-network';
import { IntroPage } from '../pages/intro/intro';
import { Http } from '@angular/http';
import { ConstantsProvider } from '../providers/constants/constants';
import { ToastsProvider } from '../providers/toasts/toasts';
import { LoadersProvider } from '../providers/loaders/loaders';
import * as firebase from 'firebase';
import { environment } from '../providers/firebase/firebase';
import { SocietiesProvider } from '../providers/society/society';
import { UserProvider } from '../providers/user/user';


import {enableProdMode} from '@angular/core';
enableProdMode();

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any, icon_name: any }>;
  private loader: any;
  private logoutAlert: any;
  private societyId: any;
  private societyInfo: any;
  private clientName: any; //used for sidemenu
  private clientAddress: any; //used for sidemenu
  private societyName: any; //used for sidemenu
  constructor(public userProvider: UserProvider, public societiesProvider: SocietiesProvider, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storage: Storage, private alertCtrl: AlertController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private network: Network, private http: Http) {
    //this.checkInstall();
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    firebase.initializeApp(environment.firebase);
    this.checkLogin();
    this.initializeApp();
    this.network.onConnect().subscribe(() => {
      this.toastCtrl.create({
        message: "Network Connected",
        duration: 3000,
      }).present();
      this.checkLogin();

    })

    this.network.onDisconnect().subscribe(() => {
      this.toastCtrl.create({
        message: "Network Disconnected",
        duration: 3000,
      }).present();
      this.nav.setRoot(NoNetworkPage);
    })

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon_name: "home" },
      { title: 'My Bookings', component: BookingsPage, icon_name: "list" },
      { title: 'Profile', component: ProfilePage, icon_name: "person" },
      { title: 'Logout', component: LogoutPage, icon_name: "log-out" }
    ];
    
        
    firebase.auth().onAuthStateChanged((user) => {

      
      if (user) {
        // User is signed in.
        // var displayName = user.displayName;
        var email = user.email;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
        // console.log((this.societiesProvider)

        firebase.database().ref('members').orderByChild('member_email').equalTo("" + email).once('value',(snapshot) => {
          let childsnapshotkey = Object.keys(snapshot.val())[0];
          // // console.log((childsnapshotkey, email);
          let userInfo = Object.getOwnPropertyDescriptor(snapshot.val(), childsnapshotkey).value;
          this.userProvider.init(userInfo)
          this.societyId = userInfo.society_id;
          this.storage.set("societyId", this.societyId);
          this.storage.set('userKey', childsnapshotkey);
          this.storage.set('emailId', email);
          // console.log(("Society Id: " + this.societyId);
          firebase.database().ref('societies').orderByChild('society_id').equalTo("" + this.societyId).on('value', (societysnapshot) => {
  
            // console.log(("Information Stored");
            let tempKey = Object.keys(societysnapshot.val())[0];
            this.societyInfo = Object.getOwnPropertyDescriptor(societysnapshot.val(),tempKey).value;
            // console.log((this.societyInfo);
  
            this.societiesProvider.init(this.societyInfo);
  
            // this.storage.set('Password', password);
            this.toastCtrl.create({
              message: 'Login Successful',
              duration: 2000,
              position: 'bottom'
            }).present();
            // this.storage.set('Info', this.clientinfo);
            this.loader.dismiss();
            this.nav.setRoot(HomePage, {
              societyInfo: this.societyInfo,
              societyId: this.societyId
            });
  
  
          });
        });
        // ...
      } else {
        // User is signed out.
        // ...
        this.loader.dismiss();
        this.nav.setRoot(LoginPage);
        // console.log(("signedout", this)

      }       

    });
  }

  checkInstall() {
    // console.log(("checkInstall");
    this.storage.get('IntroDone').then((val) => {
      //if(val == null){
      this.rootPage = IntroPage;
      this.storage.set('IntroDone', "Yes");
      //}
    });
  }

  checkLogin() {
    this.storage.get('Info').then((val) => {
      if (val == null) {
        this.nav.setRoot(LoginPage);
      } else {
        this.storage.get("societyId").then((val) => {
          this.societyId = val;
          firebase.database().ref('societies').orderByChild('society_id').equalTo("" + this.societyId).on('value', (societysnapshot) => {
            // console.log(("Information Stored");
            let tempKey = Object.keys(societysnapshot.val())[0];
            this.societyInfo = Object.getOwnPropertyDescriptor(societysnapshot.val(),tempKey).value;
            // console.log((this.societyInfo);
            this.societiesProvider.init(this.societyInfo);
            this.societyName = this.societyInfo.display_name;
            this.nav.push(HomePage, {
              societyInfo: this.societyInfo,
              societyId: this.societyId
            });
          })
        });
        //fetching values for sidemenu
        this.storage.get('Info').then((val) => {
          this.clientName = val.name;
          this.clientAddress = val.address1;
        });
        //this.rootPage = HomePage;
      }
    });
  }

  initializeApp() {
    this.splashScreen.show();
    this.statusBar.overlaysWebView(true);
    this.statusBar.backgroundColorByHexString('#956013');
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title == "Logout") {//user wants to logout
      this.logout();
    }
    else if (page.title === "Home"){//navigate to home page
      this.nav.setRoot(HomePage,{
        societyInfo: this.societyInfo,//used for dymanic fetching
        societyId: this.societyId //used for layering the societies
      });
    }
    else if (page.title === "My Bookings"){//navigate to my bookings page
      this.nav.push(BookingsPage);
    }
    else if (page.title === "Profile"){//navigate to profile page
      this.nav.push(ProfilePage);
    }
  }

  performLogoutOperation() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
  
      this.nav.setRoot(LoginPage);
      this.toastCtrl.create({
        message: 'Logged Out Successfully',
        duration: 2000,
        position: 'bottom'
      }).present();
    }).catch(function(error) {
      // An error happened.
    });


 
    this.storage.remove('Info');
    this.storage.remove('societyId');
    this.storage.remove('societyInfo');
    // this.rootPage = LoginPage;

  }

  logout() {
    this.logoutAlert = this.alertCtrl.create({
      title: "Logout",
      subTitle: "Are you sure you want to logout?",
      buttons: [{
        text: "Yes",
        handler: () => {
          this.performLogoutOperation();
        }
      },
      {
        text: "No",
        role: "cancel"
      }]
    });
    this.logoutAlert.present();
  }

  

}
