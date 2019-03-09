import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavParams, NavController } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { BookingsPage } from '../pages/bookings/bookings';
import { ProfilePage } from '../pages/profile/profile';
import { LogoutPage } from '../pages/logout/logout';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Keyboard } from '@ionic-native/keyboard';
import { SimplyBookClient } from '../providers/simplybook/client';
import { NoticesPage } from '../pages/notices/notices';
import { FacilitiesPage } from '../pages/facilities/facilities';
import { NoticePage } from '../pages/notice/notice';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DatePicker } from '@ionic-native/date-picker';
import { NbfacilityPage } from '../pages/nbfacility/nbfacility';
import { BfacilityPage } from '../pages/bfacility/bfacility';
import { CalendarPage } from '../pages/calendar/calendar';
import { NoNetworkPage } from '../pages/no-network/no-network';
import { BookingConfirmationPage } from '../pages/booking-confirmation/booking-confirmation';
import { SignupPage } from '../pages/signup/signup';
import { IntroPage } from '../pages/intro/intro';
import { ComplaintsPage } from '../pages/complaints/complaints';
import { NewcomplaintPage } from '../pages/newcomplaint/newcomplaint';
import { Camera } from '@ionic-native/camera';
import { ConstantsProvider } from '../providers/constants/constants';
import { ToastsProvider } from '../providers/toasts/toasts';
import { LoadersProvider } from '../providers/loaders/loaders';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { environment } from '../providers/firebase/firebase'
import { HttpClientModule } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BookingsPage,
    LoginPage,
    ProfilePage,
    FacilitiesPage,
    NoticesPage,
    NoticePage,
    CalendarPage,
    NbfacilityPage,
    BfacilityPage,
    BookingConfirmationPage,
    NoNetworkPage,
    SignupPage,
    LogoutPage,
    IntroPage,
    ComplaintsPage,
    NewcomplaintPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp ),
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    BookingsPage,
    ProfilePage,
    NoticesPage,
    FacilitiesPage,
    NoticePage,
    NbfacilityPage,
    BookingConfirmationPage,
    BfacilityPage,
    CalendarPage,
    NoNetworkPage,
    SignupPage,
    LogoutPage,
    IntroPage,
    ComplaintsPage,
    NewcomplaintPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    Keyboard,
    DatePicker,
    SimplyBookClient,
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConstantsProvider,
    ToastsProvider,
    LoadersProvider,
    FirebaseProvider,
    InAppBrowser
  ]
})
export class AppModule {
}
