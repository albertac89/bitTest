import {Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import {Http} from "@angular/http";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  public data = {};
  public exchange: string = 'Bitstamp (USD)';


  constructor(public navCtrl: NavController, public http: Http) {
  }

  ngOnInit() {
    this.updatePrice();
  }

  updatePrice() {
    this.http.get('/api/v2/ticker/btcusd/').subscribe(
      (response) => {
        this.data = JSON.parse(response.text());
        console.log(this.data);
      }
    );
  }

}
