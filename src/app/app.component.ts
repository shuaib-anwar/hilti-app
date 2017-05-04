import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController, ActionSheetController, ToastController } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { Profile } from '../pages/profile/profile';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { assign } from 'lodash';

@Component({
  templateUrl: 'app.html',
  providers: [NativeStorage]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  
  public profileImage = null;
  public error = null;

  public data = {
    firstName: 'Roger',
    lastName: 'Watson',
    mobile: '9560834202',
    email: 'roger.watson@hilti.com',
    company: 'Hilti India Pvt. Ltd.',
    location: 'Gurugram, Haryana'
  };

  constructor(
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    public toastCtrl: ToastController,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public modalCtrl: ModalController,
    private nativeStorage: NativeStorage) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.getProfileData();
      this.getPicture();
    });
  }

  getProfileData(){
    this.nativeStorage.getItem('person').then((data) => {
      if(data){
        assign(this.data, data);        
      }
    },
    (error) => {
      console.error(error);
    });
  }

  getPicture(){
    this.nativeStorage.getItem('picture').then((data) => {
      console.log(data);

      if(data && data.picture){
        this.profileImage = data.picture       
      }else{
        this.profileImage = null;
      }
    },
    (error) => {
      console.error(error);
    });
  }

  editProfile(){
    let profileModal = this.modalCtrl.create(Profile, {data: this.data });
  
    profileModal.onDidDismiss(data => {
      if(data){
        assign(this.data, data);
      }
    });

    profileModal.present();
  }  

  presentActionSheet() {
    this.error = null;

    var cameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select photo source',
      buttons: [{
        text: 'Use Camera',
        icon: 'camera',
        role: 'destructive',
        handler: () => {
          let options: CameraOptions = assign(cameraOptions, { sourceType: 1 })

          this.renderImage(options);
        }
      },
      {
        text: 'Photo Library',
        icon: 'image',
        handler: () => {
          let options: CameraOptions = assign(cameraOptions, { sourceType: 0 })

          this.renderImage(options);
        }
      },
      {
        text: 'Remove Pic',
        icon: 'trash',
        handler: () => {
          this.removePicture();
        }
      }]
    });

    actionSheet.present();
  }

  renderImage(options){
    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.nativeStorage.setItem('picture', {picture: base64Image}).then(() => {
        let toast = this.toastCtrl.create({
          message: 'Profile Image Updated.',
          duration: 3000
        });

        toast.present();
      },
        (error) => {
          console.error('Error storing item', error)
      });

      this.profileImage = base64Image;
    }, (err) => {
      this.error = err;
    });
  }

  removePicture(){
    this.nativeStorage.remove('picture');

    this.profileImage = null;
  }
}