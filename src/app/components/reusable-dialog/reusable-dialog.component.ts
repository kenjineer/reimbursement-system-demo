import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  remarks: string;
}

@Component({
  selector: 'app-reusable-dialog',
  templateUrl: './reusable-dialog.component.html',
  styleUrls: ['./reusable-dialog.component.css'],
})
export class ReusableDialogComponent implements OnInit {
  static componentFlag: string = '';
  static imageURL: string = '';
  static title: string = '';
  static content: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {}

  openErrorDialog(content: string, reusableDialog: MatDialog) {
    ReusableDialogComponent.componentFlag = 'Common';
    ReusableDialogComponent.title = 'Error';
    ReusableDialogComponent.content = content;
    reusableDialog.open(ReusableDialogComponent);
  }

  openSuccessDialog(content: string, reusableDialog: MatDialog) {
    ReusableDialogComponent.componentFlag = 'Common';
    ReusableDialogComponent.title = 'Success';
    ReusableDialogComponent.content = content;
    reusableDialog.open(ReusableDialogComponent);
  }

  getComponentFlag() {
    return ReusableDialogComponent.componentFlag;
  }

  getImageURL() {
    return ReusableDialogComponent.imageURL;
  }

  getDialogTitle() {
    return ReusableDialogComponent.title;
  }

  getDialogContent() {
    return ReusableDialogComponent.content;
  }
}
