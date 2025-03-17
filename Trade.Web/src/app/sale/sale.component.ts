import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from '../common/shared.service';
import { amountReceived, Customer, pos, sale, salesDetails, stockReport, user } from '../Model/models';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
  providers: [MessageService]
})
export class SaleComponent implements OnInit {
  PageTitle: string = "Sale";
  loading: boolean = false;
  saleData: sale;
  logInUserID: string;
  isEditMode = false;
  salesId: string = '0';
  currentStep: number = 1; // Step 1: Form, Step 2: Preview
  user: user;
  parties: Customer[];
  itemsList: stockReport[];
  posList: pos[];

  constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private sharedService: SharedService) {
    this.saleData = new sale();
    this.saleData.invoiceDate = new Date();
    this.saleData.salesDetails = [];
    this.saleData.amountReceived = [];
    this.saleData.amountReceived.push(new amountReceived);
    let cashAmount = new amountReceived();
    cashAmount.paymentMode = "Cash"
    this.saleData.amountReceived.push(cashAmount);
    this.logInUserID = localStorage.getItem('userid') ?? '0';
  }

  ngOnInit(): void {
    var userDetail = localStorage.getItem('AuthorizeData');
    if (userDetail) {
      this.user = JSON.parse(userDetail);
    }
    this.getCustomer();
    this.getPOS();
    this.addItem();
    this.getItem();

    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.salesId = params.get('salesId') ?? ''; // Assuming 'id' is the parameter name in your route

      if (this.salesId) {
        this.isEditMode = true;
        // this.getItem();
        // this.loadItem(this.salesId); // Fetch the item by ID if editing

        this.getItem()
          .then(() => {
            // Only call loadItem after getItem completes
            this.loadItem(this.salesId);
          })
          .catch((error) => {
            // Handle any errors in getItem
            this.showMessage('Error occurred during initialization:', error);
          });
      }
    });
  }

  loadItem(salesId: string) {
    this.loading = true;
    this.sharedService.customGetApi1<sale[]>('Sales/GetSale/' + salesId).subscribe(
      (data: any) => {
        this.loading = true;
        this.saleData = data; // Data is directly returned here as an array of User objects
        if (this.saleData.invoiceDate) {
          this.saleData.invoiceDate = new Date(this.saleData.invoiceDate);
        }
        this.saleData.salesDetails.forEach(x => {
          const selectedItem = this.itemsList.find(item => item.itemId === x.itemId && item.rate === x.rate);
          if (selectedItem) {
            x.rowNum = selectedItem.rowNum;
            x.gstper = selectedItem.gstPer;
            x.total = x.carratQty * x.rate;
          }
        });
        this.saleData.amount = this.getBillAmount();
        this.isEditMode = true;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.showMessage('Error fetching Sales details:', error);
      }
    );
  }

  getCustomer() {
    this.loading = true;
    let url = 'Customer';
    if (!this.user?.isAdmin) {
      url = 'Customer/GetCustomerByUser/' + this.logInUserID
    }
    this.sharedService.customGetApi1<Customer[]>(url).subscribe(
      (data: Customer[]) => {
        this.parties = data; // Data is directly returned here as an array of User objects
        this.parties = this.parties.map(user => ({
          ...user,
          fullName: `${user.firstName} ${user.lastName}` // Concatenate first and last name
        }));
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.showMessage('Error fetching customers:', error);
      }
    );
  }

  async getItem() {
    this.loading = true;
    await this.sharedService.customGetApi1<stockReport[]>('PurchaseMaster/StockReport/' + this.salesId).subscribe(
      (data: stockReport[]) => {
        this.itemsList = data; // Data is directly returned here as an array of User objects
        this.itemsList = this.itemsList.map(item => ({
          ...item,
          stockDisplayName: `${item.name} - ${item.rate}(${item.quantity})` // Concatenate first and last name
        }));
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.showMessage('Error fetching customers:', error);
      }
    );
  }

  getPOS() {
    this.loading = true;
    this.sharedService.customGetApi1<pos[]>('POSMaster/GetPOSByUser/' + this.logInUserID).subscribe(
      (data: pos[]) => {
        this.posList = data;
        this.posList = this.posList.map(pos => ({
          ...pos,
          posName: `${pos.tidNumber} (${pos.tidBankName})` // Concatenate first and last name
        }));
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.showMessage('Error fetching pos details:', error);
      }
    );
  }

  addItem() {
    this.saleData.salesDetails.push(new salesDetails());
  }

  // Method to calculate totals
  calculateTotal(item: any): void {
    setTimeout(() => {
      var selectedStock = this.itemsList.find(x => x.rowNum === item.rowNum);
      if (selectedStock != null && selectedStock.quantity < item.carratQty) {
        this.showMessage('error', `Quantity can not be more then available quantity. Available quantity is ${selectedStock.quantity}.`);
        setTimeout(() => {
          item.carratQty = '';  // Reset quantity if invalid
          item.total = 0;       // Reset total as well
          item.sgst = 0;        // Reset SGST
          item.cgst = 0;        // Reset CGST
          item.igst = 0;        // Reset IGST
          item.totalAmount = 0; // Reset totalAmount
          this.saleData.amount = this.getBillAmount();
          this.calculateCashAmount(true); // Recalculate Cash if needed
        }, 500);
        return;
      }

      item.total = item.carratQty * item.rate;
      let gSTAmount = (item.total * item.gstper) / 100;
      item.sgst = parseFloat((gSTAmount / 2).toFixed(2));
      item.cgst = parseFloat((gSTAmount / 2).toFixed(2));
      item.igst = parseFloat(gSTAmount.toFixed(2));
      let totalvalue = item.total + item.sgst + item.cgst;
      item.totalAmount = totalvalue - Math.floor(totalvalue) > 0.5 ? Math.ceil(totalvalue) : Math.floor(totalvalue);
      this.saleData.amount = this.getBillAmount();
      this.calculateCashAmount(this.isEditMode ? false : true);
    }, 1000);
  }

  getBillAmount(): number {
    return this.saleData.salesDetails.reduce((sum: any, item: { totalAmount: any; }) => sum + item.totalAmount, 0);
  }

  calculateCashAmount(isAddDefaultPayment: boolean, payment: any = null): void {
    if (isAddDefaultPayment) {
      this.saleData.amountReceived = [];
      this.saleData.amountReceived.push(new amountReceived);
      let cashAmount = new amountReceived();
      cashAmount.paymentMode = "Cash"
      this.saleData.amountReceived.push(cashAmount);
    }
    // if(this.saleData.amountReceived.find(x=>x.paymentMode == "Cash"){
    //   this.saleData.paymentMode = 'Cash';
    // }

    // this.saleData.cashAmount = this.saleData.billAmount - this.saleData.creditCardPaidAmount;

    let totalPaymentAmount = 0;

    // Sum up all amounts from non-cash payment modes (Creditcard, Debitcard, etc.)
    this.saleData.amountReceived.forEach(payment => {
      if (payment.paymentMode !== 'Cash') {
        totalPaymentAmount += payment.amount || 0;  // Only sum amounts for non-Cash payments
      }
    });

    // The cash amount is the remaining balance after non-cash payments
    const creditCardAmount = this.saleData.amount - totalPaymentAmount;

    if (payment != null && creditCardAmount < 0) {
      this.showMessage('error', 'Ensure the total amount paid does not exceed the bill amount.');
      payment.amount = '';
      return;
    }
    // Ensure the cash amount is not negative
    if (this.saleData.amountReceived.length == 0) {
      this.saleData.amountReceived.push(new amountReceived);
    }

    this.saleData.amountReceived.forEach(payment => {
      if (payment.paymentMode === 'Cash') {
        payment.amount = creditCardAmount;  // Set the calculated cash amount
      }
    });
  }

  onAmountChange(payment: any, index: number) {
    this.calculateCashAmount(false, payment);
  }
  // Check if the form is valid
  isFormValid(): boolean {
    //eturn this.saleData.invoiceDate && this.saleData.customerId && this.saleData.amount && this.isItemsValid();
    return true;
  }

  // Check if all items are valid
  isItemsValid(): boolean {
    //return this.saleData.items.every(x => x.itemName && x.qty > 0 && x.rate > 0);
    return true;
  }

  // Handle form submission
  onSubmit() {
    if (this.isFormValid()) {
      console.log('Form Submitted:', this.saleData);
    }
  }

  editItem(index: number): void {
    // You can add further functionality for editing an item if required
    console.log('Editing item:', this.saleData.salesDetails[index]);
  }

  // Delete item method
  deleteItem(index: number): void {
    this.saleData.salesDetails.splice(index, 1);
    this.calculateCashAmount(false);
  }

  showDetails() {
    var a = this.saleData.salesDetails;
    if (this.saleData.customerId == 0) {
      this.showMessage('error', 'Please select Party.');
      return;
    }
    else if (this.saleData.amount == 0) {
      this.showMessage('error', 'Please select Sale Item(s).');
      return;
    }
    var paidAmount = this.saleData.amountReceived.reduce((total, payment) => total + payment.amount, 0)
    if (this.saleData.amount < paidAmount) {
      this.showMessage('error', 'Paid amount is lesser than bill amount.');
      return;
    }

    if (this.isEditMode) {
      this.updateItem();
    } else {
      this.createItem();
    }
  }

  createItem() {
    this.saleData.createdBy = parseInt(this.logInUserID);
    this.saleData.createdDate = new Date();
    this.saleData.updatedBy = parseInt(this.logInUserID);
    this.saleData.updatedDate = new Date();
    const localDate = new Date(this.saleData.invoiceDate);
    this.saleData.invoiceDate = new Date(Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(), // Keep the same date in UTC
      0, 0, 0, 0 // Midnight UTC
    ));
    this.sharedService.customPostApi("Sales", this.saleData)
      .subscribe((data: any) => {
        if (data != null) {
          this.showMessage('success', `Invoice No: ${data.seriesName + data.invoiceNo} - Sale details added successfully`);
          this.clearForm();
          this.router.navigate(['salebill/' + data.id]);
        }
        else {
          this.loading = false;
          this.showMessage('error', 'Something went wrong...');
        }
      }, (ex: any) => {
        this.loading = false;
        this.showMessage('error', ex);
      });
  }

  updateItem() {
    this.saleData.updatedBy = parseInt(this.logInUserID);
    this.saleData.updatedDate = new Date();
    const localDate = new Date(this.saleData.invoiceDate);
    this.saleData.invoiceDate = new Date(Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(), // Keep the same date in UTC
      0, 0, 0, 0 // Midnight UTC
    ));
    this.sharedService.customPutApi("Sales", this.saleData)
      .subscribe((data: any) => {
        if (data != null) {
          this.showMessage('success', `Invoice No: ${data.seriesName + data.invoiceNo} - Sale details updated successfully`);
          this.clearForm();
          this.router.navigate(['salebill/' + data.id]);
        }
        else {
          this.loading = false;
          this.showMessage('error', 'Something went wrong...');
        }
      }, (ex: any) => {
        this.loading = false;
        this.showMessage('error', ex);
      });
  }

  clearForm() {
    this.isEditMode = false;
    this.saleData = new sale();
    this.saleData.invoiceDate = new Date();
    this.saleData.salesDetails = [];
    this.saleData.amountReceived = [];
    this.saleData.amountReceived.push(new amountReceived);
    let cashAmount = new amountReceived();
    cashAmount.paymentMode = "Cash"
    this.saleData.amountReceived.push(cashAmount);
    this.getItem();
    this.addItem();
    this.loading = false;
  }

  showMessage(type: string, message: string) {
    this.messageService.add({ severity: type, summary: message });
  }

  addPayment() {
    this.saleData.amountReceived.push(new amountReceived());
  }

  removePayment(index: number) {
    this.saleData.amountReceived.splice(index, 1);
    this.calculateCashAmount(false);
  }

  onPaymentModeChange(payment: amountReceived, index: number) {
    if (payment.paymentMode === 'Cash') {
      // If 'Cash' is selected, handle the remaining amount automatically
      this.updateRemainingAmount();
    }
  }

  // Ensure the remaining amount is handled with 'Cash'
  updateRemainingAmount() {
    let totalPaid = this.saleData.amountReceived.reduce((acc, payment) => acc + payment.amount, 0);
    let remainingAmount = this.saleData.amount - totalPaid;

    // If there's a remaining amount, set it to Cash
    let creditcardPayment = this.saleData.amountReceived.find(payment => payment.paymentMode === 'Cash');
    if (creditcardPayment) {
      creditcardPayment.amount = remainingAmount;
    }
  }

  onItemSelect(itemL: any) {
    const selectedItem = this.itemsList.find(item => item.rowNum === parseInt(itemL.rowNum.toString()));
    if (selectedItem) {
      this.saleData.salesDetails.forEach(x => {
        if (x.rowNum.toString() === selectedItem.rowNum.toString()) {
          x.itemId = selectedItem.itemId;
          x.rate = selectedItem.rate;
          x.gstper = selectedItem.gstPer;
        }
      });
      this.calculateTotal(itemL);
    }
  }

  goToPreview(): void {
    this.currentStep = 2;
  }

  getPosName(posId: any): string {
    var result = this.posList.find((pos) => pos.id === posId);
    return `${result?.tidNumber} (${result?.tidBankName})`;
  }

  getPartyName(partyId: any): string {
    var result = this.parties.find((party) => party.id === partyId);
    return `${result?.firstName} ${result?.lastName}`
  }

  getItemName(rowNum: any): string {
    var result = this.itemsList.find((item) => item.rowNum === rowNum);
    return `${result?.name}`;
  }

  isFieldInvalid(item: any, field: string): boolean {
    if (field == 'payAmount') {
      const selectedItem = item.amount;
      return selectedItem === null || selectedItem <= 0;
    }
    return false;
  }

  restrictDecimalInput(event: any, item: any) {
    let value = event.target.value;

    // Allow only numbers and a decimal point with up to two decimal places
    let regex = /^\d*\.?\d{0,2}$/;

    if (!regex.test(value)) {
      // If the input doesn't match, revert to the last valid value
      event.target.value = value.slice(0, -1);
      item.carratQty = event.target.value;
    } else {
      // Update the model
      item.carratQty = value;
    }
  }
}
