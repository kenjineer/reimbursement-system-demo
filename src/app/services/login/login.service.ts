import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { baseUrls } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  setLocalStorage(res) {
    const expires = moment().add(res.jwt.expiryNum, res.jwt.datetimeType);
    localStorage.setItem('token', res.jwt.token);
    localStorage.setItem('auth', res.jwt.auth);
    localStorage.setItem('expires', JSON.stringify(expires.valueOf()));
  }

  login(data): Observable<any> {
    return this.http.post(`${baseUrls.login}/login`, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
