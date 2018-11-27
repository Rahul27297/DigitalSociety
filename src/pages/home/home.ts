import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;

  slideOptions = {
    autoplay: 1000,
    loop: true
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngAfterViewInit(){
    this.slides.startAutoplay();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
