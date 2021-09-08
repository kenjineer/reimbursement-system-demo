export class CategoryRank {
  categoryName: string;
  total: number;
}

export class PendingReimbursements {
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

export class RecentReimbursements {
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
