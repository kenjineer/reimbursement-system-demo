import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { ReimbursementsService } from 'src/app/services/reimbursements/reimbursements.service';
import {
  ReimbursementsDataSource,
  ReimbursementsItem,
} from './reimbursements-datasource';
import { MatDialog } from '@angular/material/dialog';
import { ReimbursementDialogComponent } from '../reimbursements-items/reimbursement-dialog/reimbursement-dialog/reimbursement-dialog.component';
import { Reimbursement } from 'src/app/models/reimbursement.model';
import { ReusableDialogComponent } from '../reusable-dialog/reusable-dialog.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-reimbursements',
  templateUrl: './reimbursements.component.html',
  styleUrls: ['./reimbursements.component.css'],
})
export class ReimbursementsComponent implements AfterContentInit {
  constructor(
    private router: Router,
    private reimbursementsService: ReimbursementsService,
    private loginService: LoginService,
    public reimbursementDialog: MatDialog,
    private reusableDialogComponent: ReusableDialogComponent,
    private reusableDialog: MatDialog
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ReimbursementsItem>;
  dataSource: ReimbursementsDataSource;
  data: ReimbursementsItem[];
  reimbursements: Reimbursement[];
  authLevel: number;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    '_reimbursementId',
    'employeeName',
    'categoryName',
    'purpose',
    'totalCost',
    'status',
    'createdDate',
  ];

  async ngAfterContentInit() {
    try {
      if (
        this.router.url === '/api/v1/manage' &&
        localStorage.getItem('auth') === '1'
      ) {
        this.authLevel = 1;
      } else if (
        this.router.url === '/api/v1/finance' &&
        localStorage.getItem('auth') === '2'
      ) {
        this.authLevel = 2;
      } else {
        this.authLevel = 0;
      }

      const res = await this.reimbursementsService.getUserReimbursements(
        this.authLevel
      );
      this.reimbursements = res.reimbursements;
      this.data = res.reimbursements;
      this.dataSource = new ReimbursementsDataSource(this.data);
    } catch (err) {
      console.log(err);
      this.reusableDialogComponent.openErrorDialog(
        err.error?.error_message ?? err.statusText,
        this.reusableDialog
      );
      this.loginService.logout();
      this.router.navigate(['api/v1/login']);
    }

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  openReimbursement(_reimbursementId: number): void {
    const dialogRef = this.reimbursementDialog.open(
      ReimbursementDialogComponent,
      {
        width: '800px',
        height: '900px',
        data: {
          reimbursement: this.reimbursements.find(
            (data) => data._reimbursementId === _reimbursementId
          ),
          auth: this.authLevel,
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      this.ngAfterContentInit();
    });
  }

  addReimbursement(): void {
    const dialogRef = this.reimbursementDialog.open(
      ReimbursementDialogComponent,
      {
        width: '800px',
        height: '900px',
        data: { auth: this.authLevel },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      this.ngAfterContentInit();
    });
  }
}
