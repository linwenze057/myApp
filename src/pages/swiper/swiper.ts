import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

declare let Swiper: any;

@IonicPage()
@Component({
  selector: 'page-swiper',
  templateUrl: 'swiper.html'
})
export class SwiperPage {
  swiper: any;

  menus: Array<string> = ["信用卡", "贷款", "保险", "征信"];

  @ViewChild('contentSlides') contentSlides: Slides;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.initSwiper();
  }

  initSwiper() {
    this.swiper = new Swiper('.pageMenuSlides .swiper-container', {
      slidesPerView: 4,
      spaceBetween: 0,
      breakpoints: {
        1024: {
          slidesPerView: 4,
          spaceBetween: 0
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 0
        },
        640: {
          slidesPerView: 4,
          spaceBetween: 0
        },
        320: {
          slidesPerView: 4,
          spaceBetween: 0
        }
      }
    });
  }

  selectPageMenu(index) {
    this.setStyle(index);
    this.contentSlides.slideTo(index);
  }

  slideChanged() {
    let index = this.contentSlides.getActiveIndex();
    this.setStyle(index);
    this.swiper.slideTo(index, 300);
  }

  setStyle(index) {
    let slides = document.getElementsByClassName('pageMenuSlides')[0].getElementsByClassName('swiper-slide');
    if (index < slides.length) {
      for (let i = 0; i < slides.length; i++) {
        let s = slides[i];
        s.className = "swiper-slide";
      }
      slides[index].className = "swiper-slide bottomLine";
    }
  }
}
