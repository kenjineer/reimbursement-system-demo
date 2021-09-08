import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { ReusableDialogComponent } from '../reusable-dialog/reusable-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private reusableDialogComponent: ReusableDialogComponent,
    private reusableDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  doLogin() {
    if (this.formGroup.valid) {
      this.loginService.login(this.formGroup.value).subscribe(
        (res) => {
          this.loginService.setLocalStorage(res);
          this.router.navigate(['api/v1/dashboard']);
        },
        (err) => {
          console.log(err);
          this.reusableDialogComponent.openErrorDialog(
            err.error?.jwt.error_message ?? err.statusText,
            this.reusableDialog
          );
        }
      );
    } else {
      this.formGroup.markAllAsTouched();
      this.reusableDialogComponent.openErrorDialog(
        'Please input your username and password.',
        this.reusableDialog
      );
    }
  }
}
