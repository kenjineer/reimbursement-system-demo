import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface RecentTableItem {
  _reimbursementId: number;
  categoryName: string;
  purpose: string;
  totalCost: number;
  plannedDate: Date;
  status: number;
  approvalDate: Date;
  rejectionDate: Date;
  releaseDate: Date;
  createdDate: Date;
}

/**
 * Data source for the RecentTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class RecentTableDataSource extends DataSource<RecentTableItem> {
  data: RecentTableItem[];
  paginator: MatPaginator;
  sort: MatSort;

  constructor(displayData: RecentTableItem[]) {
    super();
    this.data = displayData;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<RecentTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange,
    ];

    return merge(...dataMutations).pipe(
      map(() => {
        return this.getPagedData(this.getSortedData([...this.data]));
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: RecentTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: RecentTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case '_reimbursementId':
          return compare(+a._reimbursementId, +b._reimbursementId, isAsc);
        case 'categoryName':
          return compare(a.categoryName, b.categoryName, isAsc);
        case 'purpose':
          return compare(a.purpose, b.purpose, isAsc);
        case 'totalCost':
          return compare(a.totalCost, b.totalCost, isAsc);
        case 'plannedDate':
          return compare(a.plannedDate, b.plannedDate, isAsc);
        case 'status':
          return compare(a.status, b.status, isAsc);
        case 'approvalDate':
          return compare(a.approvalDate, b.approvalDate, isAsc);
        case 'rejectionDate':
          return compare(a.rejectionDate, b.rejectionDate, isAsc);
        case 'releaseDate':
          return compare(a.releaseDate, b.releaseDate, isAsc);
        case 'createdDate':
          return compare(a.createdDate, b.createdDate, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number | Date,
  b: string | number | Date,
  isAsc: boolean
) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
