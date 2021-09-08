import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {
  PendingTableDataSource,
  PendingTableItem,
} from './pending-table-datasource';

@Component({
  selector: 'app-pending-table',
  templateUrl: './pending-table.component.html',
  styleUrls: ['./pending-table.component.css'],
})
export class PendingTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<PendingTableItem>;
  dataSource: PendingTableDataSource;
  static data: PendingTableItem[];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    '_reimbursementId',
    'categoryName',
    'purpose',
    'totalCost',
    'plannedDate',
    'createdDate',
  ];

  ngOnInit() {
    this.dataSource = new PendingTableDataSource(PendingTableComponent.data);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
