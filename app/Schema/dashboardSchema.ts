// types.ts or schema.ts

export interface ApprovedOrders {
  _id: string;
  date: string;
  customer: string;
  estimatedAmount: string;
  deadline: string;
  paperSize: string;
  pages: string;
  quantity: string;
  binding: string;
  innerPaper: string;
  innerPaperThickness: string;
  outerPaper: string;
  outerPaperThickness: string;
  innerLamination: string;
  outerLamination: string;
  inkType: string;
  deliveryOption: string;
  status: string;
  purchase_order_created: boolean | null;
}

export interface User {
  fullName: string;
}

export interface Cover {
  coverTreatmentType: string;
}

export interface Paper {
  paperType: string;
}

export interface InventoryItem {
  item: {
    itemName: string;
    availability: string;
  }[];
  type: string;
  id: string | null;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}
