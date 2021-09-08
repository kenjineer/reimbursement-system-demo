import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrls } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReimbursementsService {
  constructor(private http: HttpClient) {}

  getUserReimbursements(authority): Promise<any> {
    return this.http
      .get(`${baseUrls.reimbursements}/reimbursements/user/${authority}`)
      .toPromise();
  }

  getItems(_reimbursementId: number): Promise<any> {
    return this.http
      .get(
        `${baseUrls.reimbursements}/reimbursements/${_reimbursementId}/items`
      )
      .toPromise();
  }

  getReceipts(_reimbursementId: number): Promise<any> {
    return this.http
      .get(
        `${baseUrls.reimbursements}/reimbursements/${_reimbursementId}/receipts`
      )
      .toPromise();
  }

  getCategories(): Promise<any> {
    return this.http
      .get(`${baseUrls.reimbursements}/reimbursements/categories`)
      .toPromise();
  }

  postNewReimbursement(data: FormData) {
    return this.http.post(
      `${baseUrls.reimbursements}/reimbursements/new`,
      data
    );
  }

  putReimbursement(_reimbursementId: number, data: FormData) {
    return this.http.put(
      `${baseUrls.reimbursements}/reimbursements/${_reimbursementId}`,
      data
    );
  }

  putReimbursementStatus(
    _reimbursementId: number,
    statusFlag: number,
    remarks: string
  ) {
    return this.http.put(
      `${baseUrls.reimbursements}/reimbursements/${_reimbursementId}/status/${statusFlag}`,
      { remarks: remarks }
    );
  }

  deleteReimbursement(_reimbursementId: number) {
    return this.http.delete(
      `${baseUrls.reimbursements}/reimbursements/${_reimbursementId}`
    );
  }
}
