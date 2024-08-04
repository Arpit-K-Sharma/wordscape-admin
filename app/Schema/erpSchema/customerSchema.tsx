export interface Customer {
    userId: string;
    customerId: number;
    fullName: string;
    address: string;
    email: string;
    companyName: string;
    status: boolean;
  }
  
  export interface CustomerResponse {
    response: Customer[];
    totalElements: number;
  }