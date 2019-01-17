import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {AppGlobal, AppService} from "../../app/app.service";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    slides: Array<any> = [];
    categories: Array<any> = [];
    products: Array<any> = [];

    spinner1: boolean = true;

    params = {
        favoritesId: 0,
        pageNo: 1,
        pageSize: 20
    }

    constructor(public appService: AppService, public navCtrl: NavController) {
        this.getSlides();
        this.getCategories();
    }
    //获取幻灯片
    getSlides() {
        var params = {
            favoritesId: 2056439,
            pageNo: 1,
            pageSize: 5
        }
        this.appService.httpGet(AppGlobal.API.getProducts, params, rs => {
            this.slides = rs.data;
            this.spinner1 = false;
        })
    }
    //获取分类
    getCategories() {
        this.appService.httpGet(AppGlobal.API.getCategories, { appTag: 'dress' }, rs => {
            this.categories = rs.data;
            this.params.favoritesId = this.categories[0].FavoritesId;
            this.getProducts();
        })
    }
    //获取首页推荐列表
    getProducts() {
        this.appService.httpGet(AppGlobal.API.getProducts, this.params, rs => {
            this.products = rs.data;
        })
    }
    goDetails(item) {
        this.navCtrl.push('ProductDetailsPage', { item: item });
    }
    goProductList(c) {
        this.params.favoritesId = c.FavoritesId;
        this.params.pageNo = 1;
        this.getProducts();
    }

}
