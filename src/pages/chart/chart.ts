declare var require: any;
import {Component, ViewChild} from '@angular/core';
import {NavController, Platform, Nav} from 'ionic-angular';
import {Http} from "@angular/http";
import { ToastController } from 'ionic-angular';
import { BaseUrl, BaseUrlChart } from '../../config/base-url.config';
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
  public lineChartData:Array<any> = [];
  public lineChartLabels:Array<string> = [];
  public lineChartLegend:boolean = false;
  public lineChartType:string = 'line';
  public chart;

  constructor(public navCtrl: NavController, public http: Http, public toastCtrl: ToastController, public datePipe: DatePipe, private platform: Platform) {
  }

  setStyles() {
    let styles = {
      'width':  (+this.platform.width()-32)+'px',
      'height': this.platform.height()
    };
    return styles;
  }

  ngOnInit() {
    // this.updatePrice();
    this.setChart();
  }

  setChart() {
      this.http.get(BaseUrlChart + '/samples/data/jsonp.php?filename=new-intraday.json&callback=?').subscribe(
        (response) => {
          let data: any = response.text();

          data = data.replace('?([','[');
          data = data.replace(']);',']');

          data = JSON.parse(data);
          // console.log(data);


          Highcharts.stockChart('container', {

            title: {
              text: 'AAPL stock price by minute'
            },

            rangeSelector: {
              buttons: [{
                type: 'hour',
                count: 1,
                text: '1h'
              }, {
                type: 'day',
                count: 1,
                text: '1D'
              }, {
                type: 'all',
                count: 1,
                text: 'All'
              }],
              selected: 1,
              inputEnabled: false
            },

            series: [{
              turboThreshold: 0,
              name: 'AAPL',
              type: 'candlestick',
              data: data,
              tooltip: {
                valueDecimals: 2
              }
            }]
          });
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

  updatePrice() {
    this.http.get(BaseUrl + '/api/v2/transactions/btcusd/?time=day').subscribe(
      (response) => {
        let data = JSON.parse(response.text());
        //reset data
        this.lineChartData = [];
        this.lineChartData.push({data: []});

        //parse data
        this.parseData(data);
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
    data.forEach((value) => {
      let date = this.datePipe.transform((+value.date) * 1000, 'HH');
      if(this.lineChartLabels.indexOf(date) === -1){
        this.lineChartLabels.unshift(date);
        this.lineChartData[0].data.unshift(+value.price);
      } else {
        let index = this.lineChartLabels.indexOf(date);
        if(this.lineChartData[0].data[index] < +value.price){
          this.lineChartData[0].data[index] = +value.price;
        }
      }
    });
  }

  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartColors:Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
}
