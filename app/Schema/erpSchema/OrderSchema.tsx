export interface Order {
  orderId: string;
  date: string;
  customer: string;
  pages: number;
  quantity: number;
  status: string;
  delivery: {
    company: string;
    contactPersonName: string;
    contactPersonNumber: string;
    deliveryDate: string | null;
    deliveryTime: string | null;
    destination: string | null;
    driver: string | null;
    venue: string;
  };
  deliveryOption: string;
  deadline: string;
  estimatedAmount: number;
  remarks: string;
}

export interface Orders{
  orderId: string;
  date: string;
  pages: number;
  quantity: number;
  status: string;
  delivery: {
    company: string;
    contactPersonName: string;
    contactPersonNumber: string;
    deliveryDate: string | null;
    deliveryTime: string | null;
    destination: string | null;
    driver: string | null;
    venue: string;
  };
  deliveryOption: string;
  deadline: string;
  estimatedAmount: number;
  remarks: string;
}

export interface SelectedOrder extends Orders {
  binding: string;
  coverTreatment: any;
  outerPaperThickness: string;
  innerPaperThickness: string;
  laminationType : {
    paperType: string;
    rate: number;
    thickness: number;
  }
  outerLamination : {
    laminationType: string;
    paperType: string;
    rate: number;
    thickness: number;
  }
  paperSize: string;
  bindingType: string[];
  bindingRate: number;
  coverTreatmentType: string;
  innerPaper: {
    paperType: string;
    rate: number;
    thickness: number;
  };
  outerPaper: {
    paperType: string;
    rate: number;
    thickness: number;
  };
  innerLamination: string;
  inkType: string[];
  plateRate: number;
  customer: {
    fullName: string;
    address: string;
    phoneNumber: string;
    email: string;
  }
}

export interface Step {
  name: string;
  active: boolean;
  key: string;
}