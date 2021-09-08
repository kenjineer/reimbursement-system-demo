import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  isDashboardRoute() {
    return this.router.url === '/api/v1/dashboard';
  }

  isReimbursementsRoute() {
    return this.router.url === '/api/v1/reimbursements';
  }

  isManageRoute() {
    return this.router.url === '/api/v1/manage';
  }

  isFinanceRoute() {
    return this.router.url === '/api/v1/finance';
  }

  isAccountRoute() {
    return this.router.url === '/api/v1/account';
  }
}
