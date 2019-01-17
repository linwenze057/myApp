import { CityProvider } from './../../app/cityprovider';
import { Component, ViewChildren, ViewChild } from '@angular/core';
import { NavController, IonicPage, Content } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-city-select',
  templateUrl: 'city-select.html',
  providers: [CityProvider]
})
export class CitySelectPage {

  indexes: Array<string> = []
  cities: Array<any> = [];
  filterCities: Array<any> = [];

  @ViewChildren('cityGroup') cityGroup: any;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public cityProvider: CityProvider) {
    this.indexes = cityProvider.getIndexes();
    this.cities = cityProvider.getGroupCities();
  }
  ionViewDidLoad() {
    let $this = this;
    function alphabetMove(e: any, move: any) {
      let pPositionY = e.changedTouches[0].clientY
      let currentItem: any;
      let d = document;
      currentItem = d.elementFromPoint(d.body.clientWidth - 1, pPositionY);
      if (!currentItem || currentItem.className.indexOf('index-bar') < 0) return;
      document.getElementById('indexs-title').style.display = 'block'
      document.getElementById('indexs-title').innerText = currentItem.innerText;
      if (move) {
        let index = $this.indexes.join('').indexOf(currentItem.innerText);
        $this.content.scrollTo(0, $this.cityGroup._results[index].nativeElement.offsetTop, 300);
      }
    }
    let indexsBar = document.getElementById('indexs-bar');
    indexsBar.addEventListener('touchstart', function (e) {
      alphabetMove(e, false);
    });
    indexsBar.addEventListener('touchmove', e => {
      alphabetMove(e, false);
    });
    indexsBar.addEventListener('touchend', function (e) {
      alphabetMove(e, true);
      document.getElementById('indexs-title').style.display = 'none';
    });
  }
 
  citySelect(city: any) {
    window.localStorage["cache_currentCity"] = JSON.stringify(city);
    this.navCtrl.pop();
  }

  getItems(e: any) {
    let newVal = e.target.value;
    if (newVal) {
      this.filterCities = this.cityProvider.filterCities(newVal);
    }
    else {
      this.filterCities = [];
    }
    this.content.scrollToTop(500);
  }
}