import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Http} from "@angular/http";
import { ToastController } from 'ionic-angular';
import { BaseUrl } from '../../config/base-url.config';

@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html'
})
export class ChartPage {

  public graph = [];

  constructor(public navCtrl: NavController, public http: Http, public toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.updatePrice();
  }

  updatePrice() {
    this.http.get(BaseUrl + '/api/v2/transactions/btcusd/').subscribe(
      (response) => {
        this.graph = JSON.parse(response.text());
        console.log(this.graph);
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
