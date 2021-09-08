export class Reimbursement {
  _reimbursementId: number;
  employeeName: string;
  _categoryId: number;
  categoryName: string;
  purpose: string;
  totalCost: number;
  plannedDate: Date;
  status: number;
  approvalDate: Date;
  rejectionDate: Date;
  releaseDate: Date;
  remarks: string;
  createdDate: Date;
}

export class CategorizedReimbursement {
  categoryName: string;
  total: number;
}

export class PendingReimbursement {
  _reimbursementId: number;
  categoryName: string;
  purpose: string;
  totalCost: number;
  plannedDate: Date;
  status: number;
  approvalDate: Date;
  rejectionDate: Date;
  releaseDate: Date;
  createdDate: Date;
}

export class RecentReimbursement {
  _reimbursementId: number;
  categoryName: string;
  purpose: string;
  totalCost: number;
  plannedDate: Date;
  status: number;
  approvalDate: Date;
  rejectionDate: Date;
  releaseDate: Date;
  createdDate: Date;
}
