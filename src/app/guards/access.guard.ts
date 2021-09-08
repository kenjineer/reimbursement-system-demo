import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ReusableDialogComponent } from '../components/reusable-dialog/reusable-dialog.component';
import { LoginService } from '../services/login/login.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private reusableDialogComponent: ReusableDialogComponent,
    private reusableDialog: MatDialog
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const requiredLogin = route.data.requiredLogin || false;
    const requiredLogout = route.data.requiredLogout || false;
    const auth = localStorage.getItem('auth');
    const access = route.data.access;
    const isLoggedIn = this.loginService.isLoggedIn();
    const isLoggedOut = this.loginService.isLoggedOut();

    if ((requiredLogin && isLoggedIn) || (requiredLogout && isLoggedOut)) {
      if (auth !== '1' && access === 'manager') {
        this.router.navigate(['api/v1/dashboard']);
        return false;
      } else if (auth !== '2' && access === 'finance') {
        this.router.navigate(['api/v1/dashboard']);
        return false;
      }
      return true;
    } else if (requiredLogin && !isLoggedIn) {
      this.reusableDialogComponent.openErrorDialog(
        'Session expired! Please re-login your account.',
        this.reusableDialog
      );
      this.router.navigate(['api/v1/login']);
    } else {
      this.router.navigate(['api/v1/dashboard']);
      return false;
    }
  }
}
