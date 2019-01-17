import { HttpModule } from '@angular/http';
import { AppService, AppGlobal, ImgService, BackButtonService } from './app.service';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer, FileTransferObject }from'@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        BrowserModule, HttpModule,
        IonicModule.forRoot(MyApp, {
            backButtonText: '返回', 
            iconMode: 'ios', 
            mode: 'ios'
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp
    ],
    providers: [
        StatusBar,
        SplashScreen,
        AppService,
        AppGlobal,
        ImgService,
        BackButtonService,
        ThemeableBrowser,
        Camera,
        ImagePicker,
        File,
        FileTransferObject,
        FileTransfer,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }