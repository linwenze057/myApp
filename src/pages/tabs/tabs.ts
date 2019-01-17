import { Component, ViewChild } from '@angular/core';
import { IonicPage, Platform, Tabs } from 'ionic-angular';
import { BackButtonService } from '../../app/app.service';

@IonicPage()
@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = 'HomePage';
    tab2Root = 'ContactPage';
    tab3Root = 'AboutPage';

    @ViewChild('myTabs') tabRef: Tabs;

    constructor(public backButtonService: BackButtonService, private platform: Platform) {
        this.platform.ready().then(() => {
            this.backButtonService.registerBackButtonAction(this.tabRef);
          });
    }

    selectTab() {
        this.tabRef.select(1);
    }
}