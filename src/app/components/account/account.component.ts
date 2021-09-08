import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import User from 'src/app/models/user.model';
import { AccountService } from 'src/app/services/account/account.service';
import { ReusableDialogComponent } from '../reusable-dialog/reusable-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  accountForm = new FormGroup({
    _employeeId: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    devName: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    officeCode: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    positionName: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    nickname: new FormControl(''),
    firstname: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    middlename: new FormControl({ value: '', disabled: true }),
    lastname: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    suffix: new FormControl({ value: '', disabled: true }),
    username: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.maxLength(16),
    ]),
    confirmPassword: new FormControl(''),
    email: new FormControl({ value: '', disabled: true }, Validators.required),
    gender: new FormControl({ value: '', disabled: true }, Validators.required),
  });

  accountInfo: User;
  isPasswordMatch: boolean;

  constructor(
    private accountService: AccountService,
    private reusableDialogComponent: ReusableDialogComponent,
    private reusableDialog: MatDialog
  ) {}

  ngOnInit() {
    this.accountService.getUserAccount().subscribe((res) => {
      this.accountInfo = res.account;
      this.accountForm.controls['_employeeId'].setValue(
        this.accountInfo._userId
      );
      this.accountForm.controls['devName'].setValue(this.accountInfo.devName);
      this.accountForm.controls['officeCode'].setValue(
        this.accountInfo.officeCode
      );
      this.accountForm.controls['positionName'].setValue(
        this.accountInfo.positionName
      );
      this.accountForm.controls['nickname'].setValue(this.accountInfo.nickname);
      this.accountForm.controls['firstname'].setValue(
        this.accountInfo.firstname
      );
      this.accountForm.controls['middlename'].setValue(
        this.accountInfo.middlename
      );
      this.accountForm.controls['lastname'].setValue(this.accountInfo.lastname);
      this.accountForm.controls['suffix'].setValue(this.accountInfo.suffix);
      this.accountForm.controls['username'].setValue(this.accountInfo.username);
      this.accountForm.controls['email'].setValue(this.accountInfo.email);
      this.accountForm.controls['gender'].setValue(
        this.accountInfo.gender == 0
          ? 'Male'
          : this.accountInfo.gender == 1
          ? 'Female'
          : ''
      );
    });
  }

  passwordMatchValidator() {
    const passwordInput = this.accountForm?.controls['password'].value;
    const confirmPassword = this.accountForm?.controls['confirmPassword'].value;
    const setIsMatched = this.accountForm?.controls['confirmPassword'];
    this.isPasswordMatch = true;

    if (passwordInput && confirmPassword) {
      if (passwordInput === confirmPassword) {
        console.log('hey');
        setIsMatched.setErrors(null);
        this.isPasswordMatch = true;
      } else {
        console.log('hey2');
        setIsMatched.setErrors({ notMatched: true });
        this.isPasswordMatch = false;
      }
    }
  }

  onSubmit() {
    if (this.accountForm.valid) {
      ReusableDialogComponent.componentFlag = 'Update Account';
      const updateDialogRef = this.reusableDialog.open(ReusableDialogComponent);
      updateDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const account = this.accountForm.getRawValue() as User;
          const updateAccount = {
            nickname: account.nickname,
            username: account.username,
            password: account.password,
          };
          this.accountService.putUserAccount(updateAccount).subscribe(
            (res) => {
              this.accountForm?.controls['password'].setValue('');
              this.accountForm?.controls['confirmPassword'].setValue('');
              this.reusableDialogComponent.openSuccessDialog(
                'User account successfully updated.',
                this.reusableDialog
              );
              this.ngOnInit();
            },
            (err) => {
              console.log(err);
              this.reusableDialogComponent.openErrorDialog(
                err.error?.error_message ?? err.statusText,
                this.reusableDialog
              );
            }
          );
        }
      });
    } else {
      this.reusableDialogComponent.openErrorDialog(
        'There seems to be a problem with your input fields. Please provide the necessary information.',
        this.reusableDialog
      );
    }
  }
}
