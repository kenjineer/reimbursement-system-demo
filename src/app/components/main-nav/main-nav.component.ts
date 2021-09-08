import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login/login.service';
import { Router } from '@angular/router';
import { ReusableDialogComponent } from '../reusable-dialog/reusable-dialog.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
})
export class MainNavComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.Handset])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private loginService: LoginService,
    private router: Router,
    private reusableDialog: MatDialog
  ) {}

  openLogoutDialog() {
    ReusableDialogComponent.componentFlag = 'Logout';
    const logoutDialogRef = this.reusableDialog.open(ReusableDialogComponent);
    logoutDialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.loginService.logout();
        this.router.navigate(['api/v1/login']);
      }
    });
  }

  doLogout() {
    this.openLogoutDialog();
  }

  getAuthority() {
    return localStorage.getItem('auth');
  }

  activeRouteTitle() {
    if (this.router.url === '/api/v1/dashboard') {
      return 'Dashboard';
    } else if (this.router.url === '/api/v1/reimbursements') {
      return 'Reimbursements';
    } else if (this.router.url === '/api/v1/manage') {
      return 'Manage';
    } else if (this.router.url === '/api/v1/finance') {
      return 'Finance';
    } else if (this.router.url === '/api/v1/account') {
      return 'Account';
    }
  }
}
