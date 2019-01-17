import { LoadingController, AlertController, ToastController, ActionSheetController, Platform, App, Tabs, NavController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@Injectable()
export class BackButtonService {

  //控制硬件返回按钮是否触发，默认false
  backButtonPressed: boolean = false;

  //构造函数 依赖注入
  constructor(public platform: Platform, public appCtrl: App, public toastCtrl: ToastController) { }

  //注册方法
  registerBackButtonAction(tabRef: Tabs): void {
    
    //registerBackButtonAction是系统自带的方法
    this.platform.registerBackButtonAction(() => {
        //获取NavController
        let activeNav: NavController = this.appCtrl.getActiveNavs()[0];
        //如果可以返回上一页，则执行pop
        if (activeNav.canGoBack()) {
            activeNav.pop();
        } else {
            if (tabRef == null || tabRef._selectHistory[tabRef._selectHistory.length - 1] === tabRef.getByIndex(0).id) {
                //执行退出
                this.showExit();
            } else {
                //选择首页第一个的标签
                tabRef.select(0);
            }
        }
    });
  }

  //退出应用方法
  private showExit(): void {
    //如果为true，退出
    if (this.backButtonPressed) {
        this.platform.exitApp();
    } else {
        //第一次按，弹出Toast
        this.toastCtrl.create({
            message: '再按一次退出应用',
            duration: 2000,
            position: 'top'
        }).present();
      //标记为true
      this.backButtonPressed = true;
      //两秒后标记为false，如果退出的话，就不会执行了
      setTimeout(() => this.backButtonPressed = false, 2000);
    }
  }
}

@Injectable()
export class AppGlobal {
    //缓存key的配置
    static cache: any = {
        slides: "_dress_slides",
        categories: "_dress_categories",
        products: "_dress_products"
    }
    //接口基地址
    static domain = "https://tlimama.tongedev.cn"

    //接口地址
    static API: any = {
        getCategories: '/api/ionic3/getCategories',
        getProducts: '/api/ionic3/getProducts',
        getDetails: '/api/ionic3/details',
        uploadImgs: '/api/ionic3/uploadImgs'
    };
}

@Injectable()
export class AppService {

    constructor(public http: Http, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, ) { }

    // 对参数进行编码
    encode(params) {
        let str = '';
        if (params) {
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    let value = params[key];
                    str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                }
            }
            str = '?' + str.substring(0, str.length - 1);
        }
        return str;
    }

    httpGet(url, params, callback, loader: boolean = false) {
        let loading = this.loadingCtrl.create({});
        if (loader) {
            loading.present();
        }
        this.http.get(AppGlobal.domain + url + this.encode(params))
            .toPromise()
            .then(res => {
                let d = res.json();
                if (loader) {
                    loading.dismiss();
                }
                callback(d == null ? "[]" : d);
            })
            .catch(error => {
                if (loader) {
                    loading.dismiss();
                }
                this.handleError(error);
            });
    }

    httpPost(url, params, callback, loader: boolean = false) {
        let loading = this.loadingCtrl.create();
        if (loader) {
            loading.present();
        }
        this.http.post(AppGlobal.domain + url, params)
            .toPromise()
            .then(res => {
                let d = res.json();
                if (loader) {
                    loading.dismiss();
                }
                callback(d == null ? "[]" : d);
            }).catch(error => {
                if (loader) {
                    loading.dismiss();
                }
                this.handleError(error);
            });
    }

    private handleError(error: Response | any) {
        let msg = '';
        if (error.status == 400) {
            msg = '请求无效(code：404)';
        }
        if (error.status == 404) {
            msg = '请求资源不存在(code：404)';
        }
        if (error.status == 500) {
            msg = '服务器发生错误(code：500)';
        }
        if (msg != '') {
            this.toast(msg);
        }
    }

    alert(message, callback?) {
        if (callback) {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: [{
                    text: "确定",
                    handler: data => {
                        callback();
                    }
                }]
            });
            alert.present();
        } else {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: ["确定"]
            });
            alert.present();
        }
    }

    toast(message, callback?) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            dismissOnPageChange: true,
        });
        toast.present();
        if (callback) {
            callback();
        }
    }

    setItem(key: string, obj: any) {
        try {
            let json = JSON.stringify(obj);
            window.localStorage[key] = json;
        }
        catch (e) {
            console.error("window.localStorage error:" + e);
        }
    }

    getItem(key: string, callback) {
        try {
            let json = window.localStorage[key];
            let obj = JSON.parse(json);
            callback(obj);
        }
        catch (e) {
            console.error("window.localStorage error:" + e);
        }
    }
}

@Injectable()
export class ImgService{

    constructor(private actionSheetCtrl: ActionSheetController, private camera: Camera, private imagePicker: ImagePicker, private transfer: FileTransfer, private file: File, private fileTransfer: FileTransferObject, private appService: AppService) {
        this.fileTransfer= this.transfer.create();
    }

    showPicActionSheet() {
        this.useASComponent();
    }

    // 调用相机时传入的参数
    private cameraOpt = {
        quality: 50,
        destinationType: 1, // Camera.DestinationType.FILE_URI,
        sourceType: 1, // Camera.PictureSourceType.CAMERA,
        encodingType: 0, // Camera.EncodingType.JPEG,
        mediaType: 0, // Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true
    };
    
    // 调用相册时传入的参数
    private imagePickerOpt = {
        maximumImagesCount: 4,
        width: 800,
        height: 800,
        quality: 80
    };
    
    // 图片上传的的api
    public uploadApi:string;
    upload: any= {
        fileKey: 'upload',//接收图片时的key
        fileName: 'imageName.jpg',
        headers: {
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'//不加入 发生错误！！
        },
        params: {}, //需要额外上传的参数
        success: (data)=> { },//图片上传成功后的回调
        error: (err)=> { },//图片上传失败后的回调
        listen: ()=> { }//监听上传过程
    };

    // 使用ionic中的ActionSheet组件
    private useASComponent() {
        let actionSheet= this.actionSheetCtrl.create({
            title: '请选择',
            buttons: [
                {
                    text: '拍照',
                    handler: ()=> {
                        this.startCamera();
                    }
                },
                {
                    text: '从手机相册选择',
                    handler: ()=> {
                        this.openImgPicker();
                    }
                },
                {
                    text: '取消',
                    role: 'cancel',
                    handler: ()=> {
                    }
                }
            ]
        });
        actionSheet.present();
    }
    
    // 启动拍照功能
    private startCamera() {
        this.camera.getPicture(this.cameraOpt).then((imageData)=> {
            // this.uploadImg(imageData);
        }, (err)=>{
            this.appService.toast('ERROR:'+ err);//错误：无法使用拍照功能！
        });
    }
    
    // 打开手机相册
    private openImgPicker() {
        let temp = '';
        this.imagePicker.getPictures(this.imagePickerOpt)
            .then((results)=> {
                for (var i=0; i < results.length; i++) {
                    temp = results[i];
                }
                // this.uploadImg(temp);
            }, (err)=> {
            this.appService.toast('ERROR:'+ err);//错误：无法从手机相册中选择图片！
        });
    }
    
    // 上传图片
    private uploadImg(path: string) {
        if (!path) {
            return;
        }
        let options:any;
        options = {
            fileKey: this.upload.fileKey,
            headers: this.upload.headers,
            params: this.upload.params
        };
        this.fileTransfer.upload(path,this.uploadApi, options)
            .then((data)=> {
                if (this.upload.success) {
                    this.upload.success(JSON.parse(data.response));
                }      
            }, (err) => {
                if (this.upload.error) {
                    this.upload.error(err);
                } else {
                    this.appService.toast('错误：图片上传失败！');
                }
            });
    }
    
    // 停止上传
    stopUpload() {
        if (this.fileTransfer) {
            this.fileTransfer.abort();
        }
    }
}