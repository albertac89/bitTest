declare var require: any;
import {Component, ViewChild} from '@angular/core';
import {Nav} from 'ionic-angular';
import {Http} from "@angular/http";
import {ToastController} from 'ionic-angular';
import {BaseUrl} from '../../config/base-url.config';
import {DatePipe} from "@angular/common";

let Highcharts = require('highcharts/highstock');

@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',
  providers: [DatePipe]
})
export class ChartPage {
  @ViewChild(Nav) nav: Nav;
  public chartLoaded = false;
  private chartRequest;

  constructor(public http: Http, public toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.chartLoaded = false;
    this.setChart();
  }

  setChart() {
    this.chartRequest = this.http.get(BaseUrl + '/api/v2/transactions/btcusd/?time=day').subscribe(
      (response) => {
        let data = JSON.parse(response.text());

        //parse data
        data = this.parseData(data);

        Highcharts.stockChart('container', {
          rangeSelector: {
            buttons: [{
              type: 'hour',
              count: 6,
              text: '6h'
            }, {
              type: 'hour',
              count: 12,
              text: '12h'
            }, {
              type: 'all',
              count: 1,
              text: '1D'
            }],
            selected: 3,
            inputEnabled: false
          },

          navigator: {
            enabled: false
          },

          scrollbar: {
            enabled: false
          },

          series: [{
            turboThreshold: 0,
            name: 'BTC/USD',
            type: 'candlestick',
            data: data,
            tooltip: {
              valueDecimals: 2
            },
            dataGrouping: {
              units: [[
                'minute',
                [30]
              ]]
            }
          }]
        });
        this.chartLoaded = true;
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

  parseData(data) {
    let parsedData = [];
    data.forEach((value) => {
      let miliseconds = (value.date) * 1000;
      let stringObject = '['+miliseconds+','+value.price+','+value.price+','+value.price+','+value.price+']';
      parsedData.unshift(stringObject);
    });
    let stringData = '['+parsedData.toString()+']';
    return JSON.parse(stringData);
  }

  ionViewDidLeave() {
    this.chartRequest.unsubscribe();
  }
}
