declare var require: any;
import {Component, ViewChild} from '@angular/core';
import {NavController, Platform, Nav} from 'ionic-angular';
import {Http} from "@angular/http";
import {ToastController} from 'ionic-angular';
import {BaseUrl, BaseUrlChart} from '../../config/base-url.config';
import {DatePipe} from "@angular/common";
// import { Chart } from 'angular-highcharts/';

// import * as Highcharts from 'highcharts/highstock';

let Highcharts = require('highcharts/highstock');

@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',
  providers: [DatePipe]
})
export class ChartPage {
  @ViewChild(Nav) nav: Nav;

  public graph = [];
  // lineChart
  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<string> = [];
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';
  public chartLoaded = false;

  constructor(public navCtrl: NavController, public http: Http, public toastCtrl: ToastController, public datePipe: DatePipe, private platform: Platform) {
  }

  ngOnInit() {
    this.chartLoaded = false;
    this.setChart();
  }



  setChart() {
    this.http.get(BaseUrl + '/api/v2/transactions/btcusd/?time=day').subscribe(
      (response) => {
        let data = JSON.parse(response.text());

        //parse data
        data = this.parseData(data);

        Highcharts.stockChart('container', {

          title: {
            text: 'AAPL stock price by minute'
          },

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

          series: [{
            turboThreshold: 0,
            name: 'Bitcoin',
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
}
