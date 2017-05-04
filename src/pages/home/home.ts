import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Demo } from './demo';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	public list = [
		{
			title: 'Products',
			icon: 'megaphone'
		},
		{
			title: 'Engineering',
			icon: 'cog'
		},
		{
			title: 'Services',
			icon: 'cafe'
		},
		{
			title: 'Finance',
			icon: 'card'
		},
		{
			title: 'Company',
			icon: 'umbrella'
		},
		{
			title: 'Career',
			icon: 'search'
		}
	];

  	constructor(public navCtrl: NavController) {}

  	itemTapped() {
  		this.navCtrl.push(Demo, { data: {} });
  	}
}
