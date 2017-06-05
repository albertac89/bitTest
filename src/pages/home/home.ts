import {Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from "@angular/http";
import { ToastController } from 'ionic-angular';
import { BaseUrl } from '../../config/base-url.config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  public data = {};
  public exchange: string = 'Bitstamp (USD)';


  constructor(public navCtrl: NavController, public http: Http, public toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.updatePrice();
  }

  updatePrice() {
    this.http.get(BaseUrl + '/api/v2/ticker/btcusd/').subscribe(
      (response) => {
        this.data = JSON.parse(response.text());
        console.log(this.data);
      },
      (err) => {
        let toast = this.toastCtrl.create({
          message: err,
          duration: 5000
        });
        toast.present();
      }
    );
  }

}
