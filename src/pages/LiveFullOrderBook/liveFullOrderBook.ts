import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import Pusher from 'pusher-js';
import * as moment from 'moment';
import {BaseUrl} from '../../config/base-url.config';
import {trigger, style, transition, animate, keyframes} from '@angular/animations';
import {Http} from "@angular/http";
import _ from "lodash";

@Component({
  selector: 'page-liveFullOrderBook',
  templateUrl: 'liveFullOrderBook.html',
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
export class LiveFullOrderBook implements OnInit{

  private pusher: Pusher;
  private APP_KEY = 'de504dc5763aeef9ff52';
  private orderBookChanel: any;
  public orderBook = {asks:[], bids:[]};
  public tradeState: string = 'inactive';
  public orderBookRequest;
  private maxNumOrders:number = 100;
  private maxBid:number = 0;
  private maxAsk:number = 0;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public http: Http) {
    // this.pusher = new Pusher(this.APP_KEY);
    // this.orderBookChanel = this.pusher.subscribe('diff_order_book');
    //
    // this.orderBookChanel.bind('data', (data) => {
    //
    //   console.log(data);
    // });
    //
    // $(function () {
    //   var bidsPlaceholder = $('#bids_placeholder'),
    //     asksPlaceholder = $('#asks_placeholder'),
    //     pusher = new Pusher('de504dc5763aeef9ff52');
    //
    //   $.getJSON('https://www.bitstamp.net/api/order_book/', function (data) {
    //     var html = '<h2>Bids</h2>',
    //       i = 0;
    //
    //     for (i = 0; i < 500; i += 1) {
    //       html = html + '<div class="bid" amount="' + data.bids[i][1] + '" price="' + data.bids[i][0] + '">' + data.bids[i][1] + ' BTC @ ' + data.bids[i][0] + ' USD' + '</div>';
    //       bidsPlaceholder.html(html);
    //     }
    //
    //     html = '<h2>Asks</h2>';
    //     for (i = 0; i < 500; i += 1) {
    //       html = html + '<div class="ask" amount="' + data.asks[i][1] + '" price="' + data.asks[i][0] + '">' + data.asks[i][1] + ' BTC @ ' + data.asks[i][0] + ' USD' + '</div>';
    //       asksPlaceholder.html(html);
    //     }
    //   });
    //
    //   var orderBookChannel = pusher.subscribe('diff_order_book');
    //
    //   orderBookChannel.bind('data', function (data) {
    //     var i = 0;
    //     bidsPlaceholder.innerHTML = '';
    //     asksPlaceholder.innerHTML = '';
    //
    //     for (i = 0; i < data.bids.length; i += 1) {
    //       var found = false;
    //
    //       $('#bids_placeholder div.bid').each(function (x, el) {
    //         var price = parseFloat($(el).attr('price'));
    //         var amount = parseFloat($(el).attr('amount'));
    //
    //         if (found === false) {
    //           if (price === parseFloat(data.bids[i][0])) {
    //             if (parseFloat(data.bids[i][1]) === 0.0) {
    //               $(el).remove();
    //             } else {
    //               $(el).attr('amount', data.bids[i][1]);
    //               $(el).html(data.bids[i][1] + ' BTC @ ' + parseFloat(data.bids[i][0]).toFixed(2) + ' USD')
    //             }
    //             found = true;
    //           } else if (price < parseFloat(data.bids[i][0])) {
    //             if (parseFloat(data.bids[i][1]) > 0.0) {
    //               $(el).before('<div class="bid" amount="' + data.bids[i][1] + '" price="' + data.bids[i][0] + '">' + data.bids[i][1] + ' BTC @ ' + parseFloat(data.bids[i][0]).toFixed(2) + ' USD' + '</div>');
    //             }
    //             found = true;
    //           }
    //         }
    //       });
    //     }
    //     for (i = 0; i < data.asks.length; i += 1) {
    //       found = false;
    //       $('#asks_placeholder div.ask').each(function (x, el) {
    //         var price = parseFloat($(el).attr('price'));
    //         var amount = parseFloat($(el).attr('amount'));
    //
    //         if (found === false) {
    //           if (price === parseFloat(data.asks[i][0])) {
    //             if (parseFloat(data.asks[i][1]) === 0.0) {
    //               $(el).remove();
    //             } else {
    //               $(el).attr('amount', data.asks[i][1]);
    //               $(el).html(data.asks[i][1] + ' BTC @ ' + parseFloat(data.asks[i][0]).toFixed(2) + ' USD')
    //             }
    //             found = true;
    //           } else if (price > parseFloat(data.asks[i][0])) {
    //             if (parseFloat(data.asks[i][1]) > 0) {
    //               $(el).before('<div class="ask" amount="' + data.asks[i][1] + '" price="' + data.asks[i][0] + '">' + data.asks[i][1] + ' BTC @ ' + parseFloat(data.asks[i][0]).toFixed(2) + ' USD' + '</div>');
    //             }
    //             found = true;
    //           }
    //         }
    //       });
    //     }
    //   });
    // });
  }

  ngOnInit() {
    this.getOrderBook();
  }

  getOrderBook() {
    this.orderBookRequest = this.http.get(BaseUrl + '/api/order_book').subscribe(
      (response) => {
        let fullOrderBook = JSON.parse(response.text());
        this.orderBook.bids = _.take(fullOrderBook.bids, this.maxNumOrders);
        this.orderBook.asks = _.take(fullOrderBook.asks, this.maxNumOrders);
        this.maxBid = this.getMax(this.orderBook.bids);
        this.maxAsk = this.getMax(this.orderBook.asks);
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

  getBarWidth(amount, max) {
    let minBar = 1;
    let variation = ((amount / max)*100);
    return variation < minBar ? minBar+'px' : variation+'%';
  }

  getMax(values){
    let result = _.maxBy(values, function(o) { return +o[1]; });
    return +result[1];
  }
}
