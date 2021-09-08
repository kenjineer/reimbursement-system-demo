import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import User from 'src/app/models/user.model';
import {
  CategorizedReimbursement,
  PendingReimbursement,
  RecentReimbursement,
} from 'src/app/models/reimbursement.model';
import { Observable } from 'rxjs';
import { PendingTableComponent } from '../dashboard-items/pending-table/pending-table.component';
import { RecentTableComponent } from '../dashboard-items/recent-table/recent-table.component';
import { CategoryChartComponent } from '../dashboard-items/category-chart/category-chart.component';
import { ReusableDialogComponent } from '../reusable-dialog/reusable-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private breakpointObserver: BreakpointObserver,
    private dashboardService: DashboardService,
    private reusableDialogComponent: ReusableDialogComponent,
    private reusableDialog: MatDialog
  ) {}

  ngOnInit() {
    this.getInfo();
  }

  isLoaded: boolean;
  user: User;
  categorizedReimbursements: CategorizedReimbursement[] = [];
  pendingReimbursements: PendingReimbursement[] = [];
  recentReimbursements: RecentReimbursement[] = [];
  totalReimbursements: number = 0;
  totalRejected: number = 0;
  cards: Observable<{ title: string; cols: number; rows: number }[]>;

  setCards() {
    /** Based on the screen size, switch from standard to one column per row */
    this.cards = this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.Handset])
      .pipe(
        map(({ matches }) => {
          if (matches) {
            return [
              { title: 'Profile', cols: 2, rows: 1 },
              { title: 'Frequent Reimbursements', cols: 2, rows: 1 },
              { title: 'Recent', cols: 2, rows: 1 },
              { title: 'Pendings', cols: 2, rows: 1 },
            ];
          }

          return [
            { title: 'Profile', cols: 1, rows: 1 },
            { title: 'Frequent Reimbursements', cols: 1, rows: 1 },
            { title: 'Recent', cols: 1, rows: 1 },
            { title: 'Pendings', cols: 1, rows: 1 },
          ];
        })
      );
  }

  getInfo() {
    this.dashboardService.getUserDashboard().subscribe(
      (res) => {
        this.user = res.user;
        this.categorizedReimbursements = res.ctgReimbursements;
        this.pendingReimbursements = res.pndReimbursements;
        this.recentReimbursements = res.rctReimbursements;
        this.totalRejected = res.rjtReimbursementCnt;

        PendingTableComponent.data = this.pendingReimbursements;
        RecentTableComponent.data = this.recentReimbursements;
        CategoryChartComponent.categories = [];
        CategoryChartComponent.categoryOccurences = [];

        for (let item of this.categorizedReimbursements) {
          this.totalReimbursements += item.total;
          CategoryChartComponent.categories.push(item.categoryName);
          CategoryChartComponent.categoryOccurences.push(item.total);
        }

        this.setCards();
      },
      (err) => {
        console.log(err);
        this.reusableDialogComponent.openErrorDialog(
          err.error?.error_message ?? err.statusText,
          this.reusableDialog
        );
      }
    );
  }
}
