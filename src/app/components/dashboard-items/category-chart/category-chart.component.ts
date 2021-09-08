import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-category-chart',
  templateUrl: './category-chart.component.html',
  styleUrls: ['./category-chart.component.css'],
})
export class CategoryChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  static categories: string[] = [];
  static categoryOccurences: number[] = [];

  constructor() {}

  ngOnInit() {
    this.chartOptions = {
      series: CategoryChartComponent.categoryOccurences,
      chart: {
        type: 'donut',
      },
      labels: CategoryChartComponent.categories,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  isEmpty(): boolean {
    return CategoryChartComponent.categories.length === 0;
  }
}
