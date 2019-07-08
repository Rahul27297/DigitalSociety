import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchSocietyPage } from './search-society';

@NgModule({
  declarations: [
    SearchSocietyPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchSocietyPage),
  ],
})
export class SearchSocietyPageModule {}
