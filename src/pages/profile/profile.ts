import { Component } from '@angular/core';
import { ToastController, NavParams, ViewController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import 'rxjs/Rx';

import { assign } from 'lodash';

export class Person {
    firstName: string;
    lastName: string;
    mobile: number;
    company: string;
}

@Component({
  selector: 'user-profile',
  templateUrl: 'profile.html',
  providers: [NativeStorage]
})

export class Profile {
  person: Person;
  
  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    private nativeStorage: NativeStorage) {

    this.person = new Person();

    assign(this.person, navParams.get('data'));
  }

  back(){
    this.viewCtrl.dismiss(false);
  }

  submit(profileForm) {
    if(profileForm.valid){
      this.nativeStorage.setItem('person', profileForm.value)
        .then(() => {
          let toast = this.toastCtrl.create({
            message: 'Profile Saved Successfully.',
            duration: 3000
          });

          toast.present();
          
          this.viewCtrl.dismiss(this.person);
        },
        (error) => {
          console.error('Error storing item', error)
        }
      );
    }else{
      let toast = this.toastCtrl.create({
        message: 'Please enter the complete details.',
        duration: 3000
      });

      toast.present();
    }
  }
}
