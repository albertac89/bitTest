import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import Pusher from 'pusher-js';
import * as moment from 'moment';
import {trigger, style, transition, animate, keyframes} from '@angular/animations';

@Component({
  selector: 'page-liveTrades',
  templateUrl: 'liveTrades.html',
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
export class LiveTrades {

  private pusher: Pusher;
  private APP_KEY = 'de504dc5763aeef9ff52';
  private tradesChannel: any;
  public trades = [];
  public tradeState: string = 'inactive';
  public lastPrice = '';

  constructor(public navCtrl: NavController) {
    this.pusher = new Pusher(this.APP_KEY);
    this.tradesChannel = this.pusher.subscribe('live_trades');

    this.tradesChannel.bind('trade', (data) => {
      this.tradeState = data.type === 1 ? 'red' : 'green';
      this.lastPrice = data.price;
      if (this.trades.length > 50) {
        this.trades.pop();
      }
      this.trades.unshift(data);
    });
  }

  formatTime(time) {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    return moment(new Date(time * 1000)).format('HH:mm:ss');
  }

}
