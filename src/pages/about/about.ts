import { ImgService, AppGlobal, AppService } from './../../app/app.service';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  items = [
    { title: "我的淘宝", link: "https://h5.m.taobao.com/mlapp/mytaobao.html#mlapp-mytaobao" },
    { title: "购物车", link: "https://h5.m.taobao.com/mlapp/cart.html" },
    { title: "我的订单", link: "https://h5.m.taobao.com/mlapp/olist.html" },
    { title: "待付款", link: "https://h5.m.taobao.com/mlapp/olist.html?spm=a2141.7756461.2.1&tabCode=waitPay" },
    { title: "待发货", link: "https://h5.m.taobao.com/mlapp/olist.html?spm=a2141.7756461.2.2&tabCode=waitSend" },
    { title: "待收货", link: "https://h5.m.taobao.com/mlapp/olist.html?spm=a2141.7756461.2.3&tabCode=waitConfirm" },
    { title: "待评价", link: "https://h5.m.taobao.com/mlapp/olist.html?spm=a2141.7756461.2.4&tabCode=waitRate" }
  ];
  currentCity = {name: ''};
  constructor(public navCtrl: NavController, private themeableBrowser: ThemeableBrowser, public imgService: ImgService, public appService: AppService) {
    
  }

  ionViewWillEnter(){
    if(window.localStorage["cache_currentCity"])
      this.currentCity = JSON.parse(window.localStorage["cache_currentCity"]);
  }

  itemClick(item) {
    let options = {
      statusbar: {
        color: '#f8285c'
      },
      toolbar: {
          height: 44,
          color: '#f8285c'
      },
      title: {
          color: '#ffffffff',
          showPageTitle: true
      },
      backButton: {
          image: 'back',
          imagePressed: 'back_pressed',
          align: 'left',
          event: 'backPressed'
      },
      closeButton: {
          image: 'close',
          imagePressed: 'close_pressed',
          align: 'left',
          event: 'closePressed'
      },
      backButtonCanClose: true
    };
    this.themeableBrowser.create(item.link, '_blank', options);
  }

  citySelect(){
    this.navCtrl.push('CitySelectPage');
  }

  swiper(){
    this.navCtrl.push('SwiperPage');
  }

  imgChoice(){
    //this.initImgService();
    this.imgService.showPicActionSheet();
  }

  private initImgService(){
    this.imgService.uploadApi = AppGlobal.domain + AppGlobal.API.uploadImgs;
    this.imgService.upload.success= (data)=> {
      
    };
    this.imgService.upload.error= (err)=> {
      this.appService.toast('图片上传失败');
    };
  }

}