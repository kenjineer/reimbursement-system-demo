import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DateAdapter,
  NativeDateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { DatePipe, formatDate } from '@angular/common';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { Receipt } from 'src/app/models/receipt.model';
import { Reimbursement } from 'src/app/models/reimbursement.model';
import { Item } from 'src/app/models/item.model';
import { LoginService } from 'src/app/services/login/login.service';
import { ReimbursementsService } from 'src/app/services/reimbursements/reimbursements.service';
import { ReusableDialogComponent } from 'src/app/components/reusable-dialog/reusable-dialog.component';

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'yyyy/MM/dd', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-reimbursement-dialog',
  templateUrl: './reimbursement-dialog.component.html',
  styleUrls: ['./reimbursement-dialog.component.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    [DatePipe],
  ],
})
export class ReimbursementDialogComponent implements OnInit {
  readonly APPROVE: number = 2;
  readonly REJECT: number = 0;
  readonly RELEASE: number = 3;
  // Form Control Groups
  reimbursementFormGroup: FormGroup;
  itemFormGroup: FormGroup[];
  approvalRemarks: string = '';
  rejectionRemarks: string = '';
  releaseRemarks: string = '';

  // Fetched Data
  reimbursementData: Reimbursement;
  itemData: Item[] = [];
  receiptData: Receipt[];
  categories: Category[];
  authLevel: number;

  // Promise array
  requests: Promise<any>[];

  // Action Flags
  isAddReimbursement: Boolean;
  isEditReimbursement: Boolean;

  // Set Minimum Date: Today
  minDate: Date = new Date();

  // Image arrays
  uploadedImages: any[] = [];
  imageURLs: any[] = [];
  storedImages: Receipt[] = [];
  deletedImages: any[] = [];

  // Item arrays
  newItems: any[] = [];
  deletedItems: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ReimbursementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private reimbursementsService: ReimbursementsService,
    private loginService: LoginService,
    private router: Router,
    private datePipe: DatePipe,
    private reusableDialogComponent: ReusableDialogComponent,
    private reusableDialog: MatDialog
  ) {
    if (data.reimbursement) {
      this.reimbursementData = data.reimbursement;
      this.isAddReimbursement = false;
    } else {
      this.itemData.push(new Item(-1));
      this.isAddReimbursement = true;
    }

    this.authLevel = data.auth;
  }

  async ngOnInit() {
    try {
      this.initForm();
      this.requests = [];
      this.requests.push(this.reimbursementsService.getCategories());

      if (this.isAddReimbursement) {
        const [resCategories] = await Promise.all(this.requests);
        this.categories = resCategories.rmbCategories;
        return;
      }

      this.requests.push(
        this.reimbursementsService.getItems(
          this.reimbursementData._reimbursementId
        )
      );
      this.requests.push(
        this.reimbursementsService.getReceipts(
          this.reimbursementData._reimbursementId
        )
      );
      const [resCategories, resItems, resReceipts] = await Promise.all(
        this.requests
      );

      this.categories = resCategories.rmbCategories;
      this.itemData = resItems.rmbItems;
      this.receiptData = resReceipts.rmbReceipts;

      this.previewReceipt(this.receiptData, false);

      this.initForm();
    } catch (err) {
      console.log(err);
      this.reusableDialogComponent.openErrorDialog(
        err.error?.error_message ?? err.statusText,
        this.reusableDialog
      );
      this.loginService.logout();
      this.router.navigate(['api/v1/login']);
    }
  }

  initForm() {
    if (this.isAddReimbursement) {
      this.reimbursementFormGroup = new FormGroup({
        _categoryId: new FormControl('', Validators.required),
        purpose: new FormControl('', Validators.required),
        totalCost: new FormControl(
          { value: (0).toFixed(2), disabled: true },
          Validators.required
        ),
        plannedDate: new FormControl('', Validators.required),
        remarks: new FormControl(''),
      });

      this.itemFormGroup = [];
      this.itemFormGroup.push(
        new FormGroup({
          _itemId: new FormControl(-1),
          item: new FormControl('', Validators.required),
          qty: new FormControl(0, [Validators.required, Validators.min(0)]),
          cost: new FormControl((0).toFixed(2), [
            Validators.required,
            Validators.min(0),
          ]),
        })
      );
    } else {
      this.reimbursementFormGroup = new FormGroup({
        _categoryId: new FormControl(
          { value: this.reimbursementData._categoryId, disabled: true },
          Validators.required
        ),
        purpose: new FormControl(
          { value: this.reimbursementData.purpose, disabled: true },
          Validators.required
        ),
        totalCost: new FormControl(
          { value: this.reimbursementData.totalCost, disabled: true },
          Validators.required
        ),
        plannedDate: new FormControl(
          { value: this.reimbursementData.plannedDate, disabled: true },
          Validators.required
        ),
        status: new FormControl(
          { value: this.reimbursementData.status, disabled: true },
          Validators.required
        ),
        createdDate: new FormControl(
          {
            value: this.reimbursementData.createdDate ?? new Date(),
            disabled: true,
          },
          Validators.required
        ),
        approvalDate: new FormControl({
          value: this.reimbursementData.approvalDate,
          disabled: true,
        }),
        rejectionDate: new FormControl({
          value: this.reimbursementData.rejectionDate,
          disabled: true,
        }),
        releaseDate: new FormControl({
          value: this.reimbursementData.releaseDate,
          disabled: true,
        }),
        remarks: new FormControl({
          value: this.reimbursementData.remarks,
          disabled: true,
        }),
      });

      this.itemFormGroup = [];
      for (let item of this.itemData) {
        this.itemFormGroup.push(
          new FormGroup({
            _itemId: new FormControl(item._itemId),
            item: new FormControl(
              { value: item.item, disabled: true },
              Validators.required
            ),
            qty: new FormControl({ value: item.qty, disabled: true }, [
              Validators.required,
              Validators.min(0),
            ]),
            cost: new FormControl({ value: item.cost, disabled: true }, [
              Validators.required,
              Validators.min(0),
            ]),
          })
        );
      }
    }
  }

  toggleEdit() {
    if (this.isEditReimbursement) {
      this.reimbursementFormGroup.enable();
      for (let item of this.itemFormGroup) {
        item.enable();
      }
    } else {
      this.reimbursementFormGroup.disable();
      for (let item of this.itemFormGroup) {
        item.disable();
      }
    }

    this.reimbursementFormGroup.controls['totalCost'].disable();
    this.reimbursementFormGroup.controls['createdDate'].disable();
    this.reimbursementFormGroup.controls['approvalDate'].disable();
    this.reimbursementFormGroup.controls['rejectionDate'].disable();
  }

  formatMoney(e, i: number) {
    if (e.target.value === '') {
      let val0 = 0;
      this.itemFormGroup[i].controls['cost'].setValue(val0.toFixed(2));
    }
    let val = !Number.isNaN(Number.parseFloat(e.target.value))
      ? Number.parseFloat(e.target.value)
      : 0;
    this.itemFormGroup[i].controls['cost'].setValue(val.toFixed(2));
  }

  computeTotal() {
    let totalCost = 0;
    for (let item of this.itemFormGroup) {
      let cost = !Number.isNaN(Number.parseFloat(item.controls['cost'].value))
        ? Number.parseFloat(item.controls['cost'].value)
        : 0;
      let qty = !Number.isNaN(Number.parseFloat(item.controls['qty'].value))
        ? Number.parseFloat(item.controls['qty'].value)
        : 0;

      totalCost += cost * qty;
    }

    this.reimbursementFormGroup.controls['totalCost'].setValue(
      totalCost.toFixed(2)
    );
  }

  async previewReceipt(files, upload: boolean) {
    if (files.length === 0) return;
    let readers = [];
    let cnt = 0;

    if (upload) {
      var mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.reusableDialogComponent.openErrorDialog(
          'Only images are supported.',
          this.reusableDialog
        );
        return;
      }

      this.uploadedImages = this.uploadedImages.concat(Array.from(files));

      for (let file of files) {
        let reader = (readers[cnt] = new FileReader());
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
          this.imageURLs.push(reader.result);
        };
        cnt++;
      }
    } else {
      this.storedImages = Array.from(files);

      for (let file of files) {
        let bytes = new Uint8Array(file.image.data.length);
        for (let i = 0; i < file.image.data.length; i++) {
          bytes[i] = file.image.data[i];
        }
        let blob = new Blob([bytes], { type: file.type });

        let reader = (readers[cnt] = new FileReader());
        reader.readAsDataURL(blob);
        reader.onload = (_event) => {
          this.imageURLs.push(reader.result);
        };
        cnt++;
      }
    }
  }

  openImageDialogClick(imgURL) {
    ReusableDialogComponent.componentFlag = 'Reimbursement Receipt';
    ReusableDialogComponent.imageURL = imgURL;
    this.reusableDialog.open(ReusableDialogComponent);
  }

  deleteImageClick(imgURL, index) {
    this.imageURLs = this.imageURLs.filter((img) => img !== imgURL);
    if (index <= this.storedImages.length - 1) {
      this.deletedImages.push(
        this.storedImages.splice(index - this.uploadedImages.length, 1)[0]
          ._receiptId
      );
    } else {
      this.uploadedImages.splice(index, 1);
    }
  }

  addItemClick(): void {
    let item = new Item(this.reimbursementData?._reimbursementId ?? -1);
    this.itemData.push(item);
    this.newItems.push(-this.itemFormGroup.length - 1);
    this.itemFormGroup.push(
      new FormGroup({
        _id: new FormControl(-this.itemFormGroup.length - 1),
        item: new FormControl(
          { value: item.item, disabled: false },
          Validators.required
        ),
        qty: new FormControl(
          { value: item.qty, disabled: false },
          Validators.required
        ),
        cost: new FormControl(
          { value: item.cost.toFixed(2), disabled: false },
          Validators.required
        ),
      })
    );
  }

  deleteItemClick(item: Item, index: number): void {
    if (!item._itemId) {
      this.itemData = this.itemData.filter(
        (i) => i.createdDate !== item.createdDate
      );

      this.itemFormGroup.splice(index, 1);
    } else {
      this.deletedItems.push(item._itemId);
      this.itemData = this.itemData.filter((i) => i._itemId !== item._itemId);
      this.itemFormGroup = this.itemFormGroup.filter(
        (i) => Number.parseInt(i.controls['_itemId']?.value) !== item._itemId
      );
    }
  }

  onAddClick(): void {
    if (this.reimbursementFormGroup.valid) {
      const reimbursementInfo = this.reimbursementFormGroup.getRawValue();
      reimbursementInfo.plannedDate = this.datePipe.transform(
        reimbursementInfo.plannedDate,
        'yyyy-MM-dd hh:mm:ss'
      );
      const newReimbursementData = {
        newReimbursement: reimbursementInfo,
        newItems: [],
      };

      for (let item of this.itemFormGroup) {
        if (!item.valid) {
          this.reusableDialogComponent.openErrorDialog(
            'There seems to be a problem with your input fields. Please provide the necessary information.',
            this.reusableDialog
          );
          return;
        } else {
          newReimbursementData.newItems.push(item.getRawValue());
        }
      }

      const data = new FormData();
      data.set('data', JSON.stringify(newReimbursementData));

      for (let file of this.uploadedImages) {
        data.append('files', file, file.name);
      }
      this.reimbursementsService.postNewReimbursement(data).subscribe(
        (res) => {
          this.reusableDialogComponent.openSuccessDialog(
            'Reimbursement successfully added.',
            this.reusableDialog
          );
          this.dialogRef.close();
        },
        (err) => {
          console.log(err);
          this.reimbursementFormGroup.markAllAsTouched();
          for (let item of this.itemFormGroup) {
            item.markAllAsTouched();
          }
          this.reusableDialogComponent.openErrorDialog(
            err.error?.error_message ?? err.statusText,
            this.reusableDialog
          );
        }
      );
    } else {
      this.reimbursementFormGroup.markAllAsTouched();
      for (let item of this.itemFormGroup) {
        item.markAllAsTouched();
      }
      this.reusableDialogComponent.openErrorDialog(
        'There seems to be a problem with your input fields. Please provide the necessary information.',
        this.reusableDialog
      );
    }
  }

  onSaveClick(): void {
    if (this.reimbursementFormGroup.valid) {
      const reimbursementInfo = this.reimbursementFormGroup.getRawValue();
      reimbursementInfo.plannedDate = this.datePipe.transform(
        reimbursementInfo.plannedDate,
        'yyyy-MM-dd hh:mm:ss'
      );
      const updatedReimbursementData = {
        updatedReimbursement: reimbursementInfo,
        updatedItems: [],
        deletedReceipts: this.deletedImages,
      };

      for (let item of this.itemFormGroup) {
        if (!item.valid) {
          this.reimbursementFormGroup.markAllAsTouched();
          for (let item of this.itemFormGroup) {
            item.markAllAsTouched();
          }
          this.reusableDialogComponent.openErrorDialog(
            'There seems to be a problem with your input fields. Please provide the necessary information.',
            this.reusableDialog
          );
          return;
        } else {
          let itemIndex =
            updatedReimbursementData.updatedItems.push(item.getRawValue()) - 1;
          if (
            this.newItems.find((val) => val === item.controls['_id']?.value)
          ) {
            updatedReimbursementData.updatedItems[itemIndex]['isNew'] = 1;
            updatedReimbursementData.updatedItems[itemIndex]['isRemove'] = 0;
          } else if (
            this.deletedItems.find(
              (val) => val === item.controls['_itemId']?.value
            )
          ) {
            updatedReimbursementData.updatedItems[itemIndex]['isNew'] = 0;
            updatedReimbursementData.updatedItems[itemIndex]['isRemove'] = 1;
          } else {
            updatedReimbursementData.updatedItems[itemIndex]['isNew'] = 0;
            updatedReimbursementData.updatedItems[itemIndex]['isRemove'] = 0;
          }
        }
      }

      for (let _itemId of this.deletedItems) {
        updatedReimbursementData.updatedItems.push({
          _itemId: _itemId,
          isNew: 0,
          isRemove: 1,
        });
      }

      const data = new FormData();
      data.set('data', JSON.stringify(updatedReimbursementData));

      for (let file of this.uploadedImages) {
        data.append('files', file, file.name);
      }

      ReusableDialogComponent.componentFlag = 'Update Reimbursement';
      const updateDialogRef = this.reusableDialog.open(ReusableDialogComponent);
      updateDialogRef.afterClosed().subscribe((result) => {
        if (result == true) {
          this.reimbursementsService
            .putReimbursement(this.reimbursementData._reimbursementId, data)
            .subscribe(
              (res) => {
                this.reusableDialogComponent.openSuccessDialog(
                  'Reimbursement successfully updated.',
                  this.reusableDialog
                );
                this.dialogRef.close();
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
      this.reimbursementFormGroup.markAllAsTouched();
      for (let item of this.itemFormGroup) {
        item.markAllAsTouched();
      }
      this.reusableDialogComponent.openErrorDialog(
        'There seems to be a problem with your input fields. Please provide the necessary information.',
        this.reusableDialog
      );
    }
  }

  onCancelClick(): void {
    ReusableDialogComponent.componentFlag = 'Cancel Reimbursement';
    const cancelDialogRef = this.reusableDialog.open(ReusableDialogComponent);
    cancelDialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.reimbursementsService
          .deleteReimbursement(this.reimbursementData._reimbursementId)
          .subscribe(
            (res) => {
              this.reusableDialogComponent.openSuccessDialog(
                'Reimbursement cancelled. Reimbursement will be deleted from the database.',
                this.reusableDialog
              );
              this.dialogRef.close();
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
  }

  onApproveClick(): void {
    ReusableDialogComponent.componentFlag = 'Approve Reimbursement';
    const approveDialogRef = this.reusableDialog.open(ReusableDialogComponent, {
      data: { remarks: this.approvalRemarks },
    });
    approveDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.approvalRemarks = result;
        this.reimbursementsService
          .putReimbursementStatus(
            this.reimbursementData._reimbursementId,
            this.APPROVE,
            this.approvalRemarks
          )
          .subscribe(
            (res) => {
              this.reusableDialogComponent.openSuccessDialog(
                'Reimbursement Approved. An email will be sent to the Reimbursement Applicant.',
                this.reusableDialog
              );
              this.dialogRef.close();
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
  }

  onRejectClick(): void {
    ReusableDialogComponent.componentFlag = 'Reject Reimbursement';
    const rejectDialogRef = this.reusableDialog.open(ReusableDialogComponent, {
      data: { remarks: this.rejectionRemarks },
    });
    rejectDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.rejectionRemarks = result;
        this.reimbursementsService
          .putReimbursementStatus(
            this.reimbursementData._reimbursementId,
            this.REJECT,
            this.rejectionRemarks
          )
          .subscribe(
            (res) => {
              this.reusableDialogComponent.openSuccessDialog(
                'Reimbursement Rejected. An email will be sent to the Reimbursement Applicant.',
                this.reusableDialog
              );
              this.dialogRef.close();
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
  }

  onReleaseClick(): void {
    ReusableDialogComponent.componentFlag = 'Release Reimbursement';
    const releaseDialogRef = this.reusableDialog.open(ReusableDialogComponent, {
      data: { remarks: this.releaseRemarks },
    });
    releaseDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.releaseRemarks = result;
        this.reimbursementsService
          .putReimbursementStatus(
            this.reimbursementData._reimbursementId,
            this.RELEASE,
            this.releaseRemarks
          )
          .subscribe(
            (res) => {
              this.reusableDialogComponent.openSuccessDialog(
                'Reimbursement Released. An email will be sent to the Reimbursement Applicant.',
                this.reusableDialog
              );
              this.dialogRef.close();
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
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
