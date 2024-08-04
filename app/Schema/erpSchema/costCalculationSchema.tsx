export interface PaperSize {
    paperSizeId: number;
    paperSize: string;
    paperLength: number;
    paperBreadth: number;
  }
  
  export interface SheetSize {
    sheetSizeId: number;
    sheetSize: string;
    sheetLength: number;
    sheetBreadth: number;
    value: number;
  }
  
  export interface Paper {
    paperType: string;
    minThickness: number;
    maxThickness: number;
    rate: number;
  }
  
  export interface Plate {
    plateId: number;
    plateSize: string;
    plateLength: number;
    plateBreadth: number;
    plateRate: number;
    inkRate: number;
  }
  
  export interface Binding {
    bindingType: string;
    rate: number;
  }
  
  export interface Lamination {
    laminationType: string;
    rate: number;
  }
  
  export interface CoverTreatment {
    coverTreatmentType: string;
    rate: number;
  }
  
  export interface Ink {
    inkId: number;
    inkType: string;
  }