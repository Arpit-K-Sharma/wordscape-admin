export interface User {
    userId: string;
    username: string;
    email: string;
    password: string;
    status: boolean;
    phoneNumber: string;
  }
  
  export interface UserFormData {
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
  }