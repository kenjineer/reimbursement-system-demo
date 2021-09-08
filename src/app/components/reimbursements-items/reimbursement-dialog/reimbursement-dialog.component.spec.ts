import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementDialogComponent } from './reimbursement-dialog.component';

describe('ReimbursementDialogComponent', () => {
  let component: ReimbursementDialogComponent;
  let fixture: ComponentFixture<ReimbursementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
