
export interface Order {
    orderId: string;
    customer: string;
    date: string;
    delivery?: {
      deliveryDate: string;
    };
    estimatedAmount: number;
    status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELED';
  }
  
  export interface Step {
    name: string;
    active: boolean;
    key: string;
  }
  
  export interface TrackingData {
    [key: string]: boolean;
  }

export interface Order {
    orderId: string;
    customer: string;
  }
  
  export interface TrackingStage {
    key: string;
    label: string;
  }