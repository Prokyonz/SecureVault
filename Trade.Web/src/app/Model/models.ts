export class Customer {
    id: number = 0;
    firstName: string = '';
    lastName: string = '';
    address: string = '';
    pincode: number;
    mobileNo: string = '';
    emailId: string = '';
    aadharNo: string = '';
    panNo: string = '';
    aadharImageFrontData: string = '';
    aadhbarImageBackData: string = '';
    aadharImageFileName: string = '';
    panImageFileName: string = '';
    panImageData: string = '';
    signatureFileName: string = '';
    signatureImageData: string = '';
    createdDate: Date = new Date();
    createdBy: number = 0;
    updatedDate: Date = new Date();
    updatedBy: number = 0;
    userName: string = '';
}

export class purchase {
    id: number = 0;
    purchaseSlipNo: number = 0;
    invoiceDate: Date = new Date();
    EntryDate: Date = new Date();
    invoiceNo: number = 0;
    dealerName: string;
    description: string = '';
    brokerId: number = 0;
    discountAmount: number = 0;
    billAmount: number = 0;
    purchaseDetails: purchaseItems[];
    createdDate: Date = new Date();
    createdBy: number = 0;
    updatedDate: Date = new Date();
    updatedBy: number = 0;
    pincode: string = '';
}

export class purchaseItems {
    id: number = 0;
    itemId: number = 0;
    itemDescription: string = '';
    quantity: number = 1;
    rate: number = 0;
    gSTAmount: number = 0;
    gSTPer: number = 0;
    sGST: number = 0;
    cGST: number = 0;
    total: number = 0;
    createdDate: Date = new Date();
    createdBy: number = 0;
    updatedDate: Date = new Date();
    updatedBy: number = 0;
}

export class user {
    id: number = 0;
    parentUserId: number = 0;
    firstName: string = '';
    lastName: string = '';
    mobileNo: string = '';
    emailId: string = '';
    password: string = '';
    pin: number;
    posChilds: posChild[];
    isAgent: boolean = false;
    isAdmin: boolean = false;
    isActive: boolean = false;
    createdDate: Date = new Date();
    createdBy: number = 0;
    updatedDate: Date = new Date();
    updatedBy: number = 0;
    permissions: permissions[];
}

export class posChild {
    userId: number = 0;
    posId: number = 0;
}

export class permission {
    displayName: string;
    keyName: string;
}

export class permissions {
    userId: number;
    keyName: string;
}

export class sale {
    id: number = 0;
    customerId: number = 0;
    invoiceDate: Date = new Date();
    entryDate: Date = new Date();
    invoiceNo: number = 0;
    seriesName: string = '';
    discountAmount: number = 0;
    amount: number = 0;
    posId: number = 0;
    salesDetails: salesDetails[];
    amountReceived: amountReceived[];
    createdDate: Date = new Date();
    createdBy: number = 0;
    updatedDate: Date = new Date();
    updatedBy: number = 0;
}

export class salesDetails {
    id: number = 0;
    salesMasterId: number = 0;
    itemId: number = 0;
    carratQty: number = 1;
    rate: number = 0;
    total: number = 0;
    sgst: number = 0;
    cgst: number = 0;
    igst: number = 0;
    gstper: number = 18;
    rowNum: number = 0;
    totalAmount: number = 0;
    createdDate: Date = new Date();
    createdBy: number = 0;
    updatedDate: Date = new Date();
    updatedBy: number = 0;
}

export class amountReceived {
    id: number = 0;
    salesMasterId: number = 0;
    paymentMode: string = 'Creditcard';
    cardNo: string = '';
    nameOnCard: string = '';
    amount: number = 0;
    createdDate: Date = new Date();
    createdBy: number = 0;
    updatedDate: Date = new Date();
    updatedBy: number = 0;
}

export class item {
    id: number = 0;
    name: string = '';
    description: string = '';
    hsnCode: string = '';
    gstPercentage: number = 0;
    isActive: boolean = true;
    createdDate: Date = new Date();
    createdBy: number = 0;
    updatedDate: Date = new Date();
    updatedBy: number = 0;
}

export class purchaseReport {
    id: number = 0;
    invoiceNo: number = 0;
    invoiceDate: Date = new Date();
    dealerName: string = '';
    billAmount: number = 0;
}

export class saleReport {
    id: number = 0;
    invoiceNo: string = '';
    invoiceDate: Date = new Date();
    userName: string = '';
    partyName: string = '';
    billAmount: number = 0;
    paymentNo: string = '';
    paymentMode: string = '';
    cardNo: string = '';
    paidAmount: number = 0;
}

export class stockReport {
    rowNum: number = 0;
    itemId: number = 0;
    name: string = '';
    quantity: number = 0;
    rate: number = 0;
    gstPer: number = 0;
}

export class pos {
    id: number = 0;
    tidNumber: string = '';
    tidBankName: string = '';
    isActive: boolean = false;
    createdDate: Date = new Date();
    createdBy: number = 0;
    updatedDate: Date = new Date();
    updatedBy: number = 0;
}

export class series {
    id: number = 0;
    name: string = '';
    isActive: boolean = false;
}

export class filterCriteria {
    fromDate: Date | null;
    toDate: Date | null;
    name: string;
}

export class saleBillPrint {
    id: number = 0;
    invoiceNo: string = '';
    invoiceDate: Date = new Date();
    partyName: string = '';
    roundupAmount: number = 0;
    billAmount: number = 0;
    totalQty: number = 0;
    sgst: number = 0;
    cgst: number = 0;
    igst: number = 0;
    billAmountInWords: string = '';
    billAmountWithoutTax: number = 0;
    address: string = '';
    mobileNo: string = '';
    emailId: string = '';
    panNo: string = '';
    pincode: number = 0;
    brokerName: string = '';
    creationDate: string = '';
    saleBillItems: saleBillItems[];
    saleBillPayments: saleBillPayments[];
}

export class saleBillItems {
    id: number = 0;
    serialNo: number = 0;
    itemName: string = '';
    carratQty: number = 0;
    rate: number = 0;
    totalAmount: number = 0;
    sgst: number = 0;
    cgst: number = 0;
    igst: number = 0;
}

export class saleBillPayments {
    id: number = 0;
    paymentNo: string = '';
    paymentMode: string = '';
    cardNo: string = '';
    paidAmount: number = 0;
}