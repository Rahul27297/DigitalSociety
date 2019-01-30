import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
/*
  Generated class for the LoadersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.

  This provider class will display loader whenever instantiated
*/
@Injectable()
export class LoadersProvider {

  constructor(private loadingCtrl: LoadingController, private message: string) {
    this.loadingCtrl.create({
      content: this.message
    }).present();
  }

  /*presentLoader(private loadingCtrl: LoadingController, private message: string) {
    this.loadingCtrl.create({
      content: this.message
    }).present();

  }*/

}
