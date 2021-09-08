import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { AccessGuard } from './guards/access.guard';

const routes: Routes = [
  { path: '', redirectTo: 'api/v1/login', pathMatch: 'full' },
  {
    path: 'api/v1/login',
    component: LoginComponent,
    data: { requiredLogout: true },
    canActivate: [AccessGuard],
  },
  {
    path: 'api/v1/dashboard',
    component: MainComponent,
    data: { requiredLogin: true },
    canActivate: [AccessGuard],
  },
  {
    path: 'api/v1/reimbursements',
    component: MainComponent,
    data: { requiredLogin: true },
    canActivate: [AccessGuard],
  },
  {
    path: 'api/v1/manage',
    component: MainComponent,
    data: {
      requiredLogin: true,
      access: 'manager',
    },
    canActivate: [AccessGuard],
  },
  {
    path: 'api/v1/finance',
    component: MainComponent,
    data: {
      requiredLogin: true,
      access: 'finance',
    },
    canActivate: [AccessGuard],
  },
  {
    path: 'api/v1/account',
    component: MainComponent,
    data: { requiredLogin: true },
    canActivate: [AccessGuard],
  },
  { path: '**', redirectTo: 'api/v1/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
