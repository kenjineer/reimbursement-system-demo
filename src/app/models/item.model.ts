export class Item {
  _itemId: number;
  _reimbursementId: number;
  item: string;
  qty: number;
  cost: number;
  approved: number;
  createdDate: Date;
  updatedDate: Date;

  constructor(_reimbursementId: number) {
    this._itemId = null;
    this._reimbursementId = _reimbursementId;
    this.item = '';
    this.qty = 0;
    this.cost = 0;
    this.approved = 0;
    this.createdDate = new Date();
    this.updatedDate = new Date();
  }
}
