export interface Order {
    orderId: string;
    customer: string;
  }
  
  export interface JobCard {
    orderId: number;
    date: string;
    job_card_id: string;
    deadline: string;
    paperSize: string;
    pages: number;
    quantity: number;
    binding: string;
    coverTreatment: {
      coverTreatmentId: number;
      coverTreatmentType: string;
      rate: number;
    };
    innerPaper: {
      paperId: number;
      paperType: string;
      rate: number;
    };
    innerPaperThickness: number;
    outerPaper: {
      paperId: number;
      paperType: string;
      rate: number;
    };
    outerPaperThickness: number;
    innerLamination: {
      laminationId: number;
      laminationType: string;
      rate: number;
    };
    outerLamination: {
      laminationId: number;
      laminationType: string;
      rate: number;
    };
    plate: null;
    inkType: string;
    deliveryOption: null;
    remarks: null;
    status: string;
    bindingRate: number;
    innerPaperRate: number;
    innerLaminationRate: number;
    outerLaminationRate: number;
    outerPaperRate: number;
    plateRate: number;
    estimatedAmount: number;
    pdfFilename: string;
    customer: {
      customerId: number;
      fullName: string;
      created_at: null;
      address: string;
      email: string;
      password: null;
      phoneNumber: string;
      companyName: string;
      status: boolean;
      salesBookList: any[];
      salesRecordList: any[];
      role: string;
    };
    salesBook: null;
    salesRecordList: any[];
    prePressUnitList: {
      prePressUnitId: number;
      paymentMethod: string;
      serviceRequired: string[];
    };
    delivery: {
      deliveryId: number;
      destination: null;
      deliveryDate: null;
      deliveryTime: null;
      company: string;
      venue: string;
      contactPersonName: string;
      contactPersonNumber: string;
      driver: null;
    };
    prePressData: {
      prePressDataId: number;
      paymentMethod: string;
      materialReceived: string;
      flapSize: string;
    };
    paperDetailData: {
      paperDetailDataId: number;
      paperSize: string;
      gutterSize: string;
      gripperSize: string;
      coverPaperSize: string;
      innerPaperSize: string;
      folderName: string;
      plateProcessBy: string;
    };
    plateDetailData: {
      plateDetailDataId: number;
      screenType: string;
      plateDamage: string;
      plateRemake: string;
      plateData: Array<{
        plateDataId: number;
        size: string | null;
        colour1: string | null;
        colour2: string | null;
        colour3: string | null;
        colour4: string | null;
        special: string | null;
        total: null;
      }>;
    };
    paperData: {
      paperDataId: number;
      paperData0: {
        paperData0_id: number;
        readyBy: string;
        date: string;
        time: string;
        type: string;
        size: string;
        numberOfPages: string;
        printrun: string;
        side: string;
      };
      paperData1: Array<{
        paperData1_id: number;
        type: string;
        fullSheetSize: string | null;
        weight: string | null;
        paperType: string | null;
        totalSheets: string | null;
      }>;
      paperData2: Array<{
        paperData2_id: number;
        type: string;
        cutSheetSize: string | null;
        wastage: string | null;
        totalCutSheet: string | null;
      }>;
      paperData3: Array<{
        paperData3_id: number;
        type: string | null;
        gsm: string | null;
        printColor: string | null;
        lamination: string | null;
        ptype: string | null;
      }>;
    };
    pressUnitData: {
      pressUnitDataId: number;
      totalSet: string;
      forma: string;
      workAndTurn: string;
      pressData: Array<{
        pressDataId: number;
        paperType: string | null;
        size: string | null;
        signature: string | null;
        ordered: string | null;
        produced: string | null;
      }>;
    };
    bindingData: {
      bindingUnitId: number;
      binderySelectedOption: string[];
      filledInBy: string;
      approvedBy: string;
    };
    costCalculation: {
      costCalculationId: number;
      plates: number;
      printing: number;
      paper: number;
      coverPaper: number;
      innerPaper: number;
      otherPaper: number;
      lamination: number;
      binding: number;
      finishing: number;
      extraCharges: number;
      subTotal: number;
      vat: number;
      grandTotal: number;
      preparedBy: string;
      approvedBy: string;
    };
    projectTracking: {
      projectTrackingId: number;
      orderSlip: boolean;
      jobCard: boolean;
      paperCutting: boolean;
      platePreparation: boolean;
      printing: boolean;
      postPress: boolean;
      delivery: boolean;
      invoice: boolean;
      end: boolean;
    };
  }
  
  export interface CookiesData {
    paperDetailData: any;
    binderyData: any;
    deliveryDetail: any;
    paperData: any;
    prePressUnitList: any;
    plateDetailData: any;
    prePressData: any;
    pressUnitData: any;
    costCalculation: any;
  }