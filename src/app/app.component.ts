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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storage: Storage, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.checkLogin();
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'My Bookings', component: BookingsPage },
      { title: 'Profile', component: ProfilePage },
      { title: 'Logout', component: LogoutPage }
    ];

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

  logout(){
    this.alertCtrl.create({
      title: "Logout",
      subTitle: "Are you sure you want to logout of Sankul App?",
      buttons: [{
        text: "Yes",
        handler: () => {
          this.storage.remove('Info');
          this.toastCtrl.create({
            message: 'Logged Out Successfully',
            duration: 2000,
            position: 'bottom'
          }).present();
          this.rootPage = LoginPage;
        }
      },
    {
      text: "No",
      role: "cancel" 
    }]
    }).present();
  }
}
