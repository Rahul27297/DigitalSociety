import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the SearchSocietyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-society',
  templateUrl: 'search-society.html',
})
export class SearchSocietyPage {

  allSocieties: any = []
  filteredSocieties: any = [];
  searchTerm: any ;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchSocietyPage');
  }

  ngOnInit() {
    this.allSocieties = this.navParams.get('societies');
    this.filteredSocieties = this.navParams.get('societies');
    console.log(this.allSocieties);
    console.log(this.filteredSocieties);

  }

  onInput(event: any) {
    console.log(event)
    this.filterItems(this.searchTerm)
  }

  filterItems(searchTerm) {
    this.filteredSocieties =  this.allSocieties.filter(item => {
      console.log(item)
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
    console.log(this.filteredSocieties);
  }
  
  onTap(selectedSociety) {
    console.log(selectedSociety);
    this.viewCtrl.dismiss(selectedSociety);
  }

}
