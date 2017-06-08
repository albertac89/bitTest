import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import Pusher from 'pusher-js';
// import * as moment from 'moment';
// import {BaseUrl} from '../../config/base-url.config';
import {trigger, style, transition, animate, keyframes} from '@angular/animations';
import {Http} from "@angular/http";
import _ from "lodash";

@Component({
  selector: 'page-liveOrderBook',
  templateUrl: 'liveOrderBook.html',
  animations: [
    trigger('trade', [
      transition('void => red', [
        animate(1000, keyframes([
          style({opacity: 0, transform: 'translateY(-100%)', offset: 0}),
          style({backgroundColor: 'red', opacity: 0.3, transform: 'translateX(0)', offset: 0.3}),
          style({backgroundColor: 'white', opacity: 1, transform: 'translateY(0)', offset: 1.0})
        ]))
      ]),
      transition('void => green', [
        animate(1000, keyframes([
          style({opacity: 0, transform: 'translateY(-100%)', offset: 0}),
          style({backgroundColor: 'green', opacity: 0.3, transform: 'translateX(0)', offset: 0.3}),
          style({backgroundColor: 'white', opacity: 1, transform: 'translateY(0)', offset: 1.0})
        ]))
      ])
    ])
  ]
})
export class LiveOrderBook implements OnInit{

  private pusher: Pusher;
  private APP_KEY = 'de504dc5763aeef9ff52';
  private orderBookChanel: any;
  public orderBook = {asks:[], bids:[]};
  public tradeState: string = 'inactive';
  // public orderBookRequest;
  // private maxNumOrders:number = 100;
  private maxBid:number = 0;
  private maxAsk:number = 0;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public http: Http) {
  }

  ngOnInit() {
    this.getOrderBook();
  }

  getOrderBook() {
    this.pusher = new Pusher(this.APP_KEY);
    this.orderBookChanel = this.pusher.subscribe('order_book');

    this.orderBookChanel.bind('data', (fullOrderBook) => {
      this.orderBook.bids = fullOrderBook.bids;
      this.orderBook.asks = fullOrderBook.asks;
      this.maxBid = this.getMax(this.orderBook.bids);
      this.maxAsk = this.getMax(this.orderBook.asks);
    });
    // this.orderBookRequest = this.http.get(BaseUrl + '/api/order_book').subscribe(
    //   (response) => {
    //     let fullOrderBook = JSON.parse(response.text());
    //     this.orderBook.bids = _.take(fullOrderBook.bids, this.maxNumOrders);
    //     this.orderBook.asks = _.take(fullOrderBook.asks, this.maxNumOrders);
    //     this.maxBid = this.getMax(this.orderBook.bids);
    //     this.maxAsk = this.getMax(this.orderBook.asks);
    //   },
    //   (err) => {
    //     let toast = this.toastCtrl.create({
    //       message: err,
    //       duration: 5000
    //     });
    //     toast.present();
    //   }
    // );
  }

  getBarWidth(amount, max) {
    let minBar = 1;
    let variation = ((amount / max)*100);
    return variation < minBar ? minBar+'px' : variation+'%';
  }

  getMax(values){
    let result = _.maxBy(values, function(o) { return +o[1]; });
    return +result[1];
  }

  filterNumber(number) {
    number = +number;
    return number.toFixed(2)
  }
}
