import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Http} from "@angular/http";

@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html'
})
export class ChartPage {

  public graph = [];

  constructor(public navCtrl: NavController, public http: Http) {
  }

  ngOnInit() {
    this.updatePrice();
  }

  updatePrice() {
    this.http.get('/api/v2/transactions/btcusd/').subscribe(
      (response) => {
        this.graph = JSON.parse(response.text());
        console.log(this.graph);
      }
    );
  }


}
