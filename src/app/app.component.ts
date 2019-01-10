import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;
  private loader: any;
  private logoutAlert: any;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storage: Storage, private alertCtrl: AlertController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private network: Network) {
    //this.checkInstall();
    this.checkLogin();
    this.initializeApp();

    this.network.onConnect().subscribe(()=>{
      this.toastCtrl.create({
        message: "Network Connected",
        duration: 3000,
      }).present();
      this.rootPage = HomePage;
    })
 
    this.network.onDisconnect().subscribe(()=>{
      this.toastCtrl.create({
        message: "Network Disconnected",
        duration: 3000,
      }).present();
      this.rootPage = NoNetworkPage;
    })

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'My Bookings', component: BookingsPage },
      { title: 'Profile', component: ProfilePage },
      { title: 'Logout', component: LogoutPage }
    ];
    this.logoutAlert = this.alertCtrl.create({
      title: "Logout",
      subTitle: "Are you sure you want to logout of Sankul App?",
      buttons: [{
        text: "Yes",
        handler: () => {
          this.displayLoader();
        }
      },
    {
      text: "No",
      role: "cancel" 
    }]
    });
  }

  checkInstall(){
    console.log("checkInstall");
    this.storage.get('IntroDone').then((val) => {
      //if(val == null){
        this.rootPage = IntroPage;
        this.storage.set('IntroDone', "Yes");
      //}
    });
  }

  checkLogin(){
    this.storage.get('Info').then((val) => {
      if(val == null){
        console.log("NULL value");
        this.rootPage = LoginPage;
      }else{
        this.rootPage = HomePage;
      }
    });
  }

  initializeApp() {
    this.splashScreen.show();
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title == "Logout"){
      this.logout();
    }
    else{
      this.nav.setRoot(page.component);
    }
  }

  performLogoutOperation(){
  this.storage.remove('Info');
  this.rootPage = LoginPage;
  this.toastCtrl.create({
    message: 'Logged Out Successfully',
    duration: 2000,
    position: 'bottom'
  }).present();
  this.loader.dismiss();
  console.log(this.rootPage);
  }

  displayLoader(){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    setTimeout(() => {
      this.performLogoutOperation();
    }, 1000);
  }

  logout(){
    this.logoutAlert.present();
  }
}
