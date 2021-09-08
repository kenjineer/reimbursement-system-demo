import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrls } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  getUserAccount(): Observable<any> {
    return this.http.get(`${baseUrls.account}/account`);
  }

  putUserAccount(data: Object) {
    return this.http.put(`${baseUrls.account}/account`, data);
  }
}
