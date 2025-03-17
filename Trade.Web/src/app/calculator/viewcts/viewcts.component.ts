import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { SharedService } from '../../common/shared.service';
import { RememberCompany } from '../../shared/component/companyselection/companyselection.component';

interface CalculatorMaster{
  srNo: number,
  Date: Date,
  companyId: string,
  financialYearId: string,
  branchId: string,
  PartyId: string,
  PartyName: string,
  BrokerId: string,
  BrokerName: string,
  NetCarat: number,
  Note: string,
  sizeDetails: SizeDetails[] | null,
  UserId: string              
}

interface NumberDetails {
  sizeId: string,
  numberId: string,
  carat: number,
  rate: number,
  numberName: string,
  percentage: number,
  amount: number
  //sizename: string
}

interface SizeDetails{
  sizeId: string,
  sizeName: string,
  totalCarat: number,
  numberDetails: NumberDetails[]
}

interface Summary {
  sizeId:string,
  sizeName:string,
  percentage: number,
  amount: number,
  totCarat: number 
}

interface Customer {
  name: string,
  country: string,
  date: string,
  balance: number,
  verified: boolean
}

@Component({
  selector: 'app-viewcts',
  templateUrl: './viewcts.component.html',
  styleUrls: ['./viewcts.component.scss'],
  providers: [MessageService]
})

export class ViewctsComponent implements OnInit{
  showViewSection:boolean = false;
  showAddSection:boolean = false;
  showHomeSection:boolean = true;
  showHistory: boolean = true;
  PageTitle:string = "History";
  loading: boolean = false;
  branches: any[] = [];
  party: any[] = [];
  dealers: any[] = [];
  sizes: any[] = [];
  numbers: any[] = [];
  pricelist: any[] = [];
  comanyid: string = "";
  NumberDetails: NumberDetails[] = [];
  SizeDetails: SizeDetails[] = [];
  summatydata: Summary[] = [];
  selectednumber: any;
  selectedsize: any;
  selectedcarat : number = 0;
  netcarat: number = 0;
  selectedtotalcarat: number = 0;
  valueTextArea: string;
  summaryTotAmount = 0;
  date: Date = new Date();
  branchid: any = [];
  partyid: any = [];
  dealerid: any = [];
  calculatorListData: CalculatorMaster[] = [];
  note: string = '';
  calculator: CalculatorMaster;
  isSaveButton: boolean = true;
  RememberCompany: RememberCompany = new RememberCompany();
  constructor(private router: Router, private messageService: MessageService, private sharedService: SharedService) {

  }
  ngOnInit(): void {
    debugger;
    this.getCompanyData();
    this.calculatorList();
    
  }

  customers: Customer[] = [
    { name: 'Abhishek', country: 'India', date: '12/12/2014', balance: 25000, verified: true },
    { name: 'Anand', country: 'India', date: '12/12/2014', balance: 28000, verified: false },
    { name: 'Shaielsh', country: 'USA', date: '01/11/2015', balance: 45000, verified: false },
    { name: 'Akshay', country: 'UK', date: '01/11/2017', balance: 145000, verified: false },
    { name: 'Abhishek', country: 'India', date: '12/12/2014', balance: 25000, verified: true },
    { name: 'Anand', country: 'India', date: '12/12/2014', balance: 28000, verified: false },
    { name: 'Shaielsh', country: 'USA', date: '01/11/2015', balance: 45000, verified: false },
    { name: 'Akshay', country: 'UK', date: '01/11/2017', balance: 145000, verified: false },
    { name: 'Abhishek', country: 'India', date: '12/12/2014', balance: 25000, verified: true },
    { name: 'Anand', country: 'India', date: '12/12/2014', balance: 28000, verified: false },
    { name: 'Shaielsh', country: 'USA', date: '01/11/2015', balance: 45000, verified: false },
    { name: 'Akshay', country: 'UK', date: '01/11/2017', balance: 145000, verified: false },
  ];  

  myfunction() {
    if(this.showViewSection == true && this.isSaveButton) {
      this.showAddSection = true;
      this.showViewSection = false;
      this.showHomeSection = false;
      this.PageTitle = "Add Details";      
    }
    else{
      debugger;
      if (!this.isSaveButton){
        this.isSaveButton = true;
        this.showAddSection = false;
        this.showViewSection = false;
        this.showHomeSection = false;
        this.showHistory = true;
        this.PageTitle = "History";
        this.clearForm();
      }
      else{
      this.router.navigate(["dashboard"]);
      }
    }
  }

  showDetails() {
    if (this.date == null)
    {
      this.showMessage('error','Select any date');
      return;
    }
    if (this.branchid.id == '')
    {
      this.showMessage('error',"Select any branch");
      return;
    }
    if (this.partyid.id == '')
    {
      this.showMessage('error','Select any party');
      return;
    }
    if (this.dealerid.id == '')
    {
      this.showMessage('error','Select any broker');
      return;
    }
    if (this.netcarat <= 0)
    {
      this.showMessage('error','Netcarat can not be less than or equal to zero');
      return;
    }
    if (this.NumberDetails.length == 0)
    {
      this.showMessage('error','Carat item can not be empty');
      return;
    }
    this.isSaveButton = true;
    this.PageTitle = "View Details";
    this.showAddSection = false;
    this.showViewSection = true;
    this.showHomeSection = false;
    this.showHistory = false;
    this.SizeDetails.forEach(element => {
      element.numberDetails = this.NumberDetails.filter(e => e.sizeId == element.sizeId);
    });
    this.calulateSummary();
  }

  getCompanyData(){
    debugger;
    const data = localStorage.getItem("companyremember");
    if (data != null){
      this.RememberCompany = this.sharedService.JsonConvert<RememberCompany>(data)
    }
  }

  calculatorList(){
    this.sharedService.customGetApi("Calculator/GetCalculatorReport?CompanyId=" + this.RememberCompany.company.id + "&FinancialYearId=" + this.RememberCompany.financialyear.id +"&FromDate=20230501&ToDate=20230520")
    .subscribe((data: any) => {
          this.calculatorListData = data;
          console.log(this.calculatorListData);
        }, (ex: any) => {
          this.showMessage('error',ex);
      });
  }

  calulateSummary(){
    this.summaryTotAmount = 0;
    this.summatydata.forEach(e => {
      let filteredSize = this.NumberDetails.filter((f) => {
        return f.sizeId == e.sizeId;
      });
      
      let totalAmount = filteredSize.reduce((acc, curr) => {
        return acc + curr.amount;
      }, 0);      

      e.amount = totalAmount;
      e.percentage = (e.totCarat / this.netcarat)*100;
      this.summaryTotAmount = this.summaryTotAmount + e.amount;
    });
  }

  getparty(){
    this.sharedService.customGetApi("Service/GetParty?companyid=" + this.RememberCompany.company.id).subscribe((t) => {
      if (t.success == true){
        if (t.data != null && t.data.length > 0){
          t.data = [
            { name: '-Select-', id: '' },
            ...t.data
          ];
          this.party = t.data;
        }
      }
    });      
  }

  getdealer(){
    this.sharedService.customGetApi("Service/GetDealer?companyid=" + this.RememberCompany.company.id).subscribe((t) => {
      if (t.success == true){
        if (t.data != null && t.data.length > 0){
          t.data = [
            { name: '-Select-', id: '' },
            ...t.data
          ];
          this.dealers = t.data;
        }
      }
    });      
  }

  getbranch(){
    this.sharedService.customGetApi("Service/GetBranch?companyid=" + this.RememberCompany.company.id).subscribe((t) => {
      if (t.success == true){
        if (t.data != null && t.data.length > 0){
          t.data = [
            { name: '-Select-', id: '' },
            ...t.data
          ];
          this.branches = t.data;
        }
      }
    });      
  }

  getsize(){
      this.sharedService.customGetApi("Service/GetSize").subscribe((t) => {
        if (t.success == true){
          if (t.data != null && t.data.length > 0){          
            t.data = [
              { name: '-Select-', id: '' },
              ...t.data
            ];
          }
        }
        this.sizes = t.data;
      });      
  }

  getnumber(){
    this.sharedService.customGetApi("Service/GetNumber").subscribe((t) => {
      if (t.success == true){
        if (t.success == true){
          if (t.data != null && t.data.length > 0){          
            t.data = [
              { name: '-Select-', id: '' },
              ...t.data
            ];
          }
        }
        this.numbers = t.data;
      }
    });      
  }

  getAllNumberPrice(){
    this.sharedService.customGetApi("Service/GetAllNumberPrice?companyId=" + this.RememberCompany.company.id + "&categoryId=0").subscribe((t) => {
      if (t.success == true){
       this.pricelist = t.data;
      }
    });      
  }

  handlesize(event: any) {
    this.selectedsize = event.value;
    var caratData = this.SizeDetails.filter(e => e.sizeId == this.selectedsize.id);
    if (caratData != null && caratData.length > 0){
      this.selectedtotalcarat = caratData[0].totalCarat;
    }
    else{
      this.selectedtotalcarat = 0;
    }
  }

  viewdata(){
    debugger;
    //console.log(this.caratData);
  }

  handlenumber(event: any) {
    this.selectednumber = event.value.number;
  }
  handleparty(event: any){
    this.partyid = event.value;
  }

  handlebranch(event: any){
    this.branchid = event.value;
  }

  handledealer(event: any){
    this.dealerid = event.value;
  }

  handledate(event: any){
    this.date = event.value;
  }
  
  addItems(){
    if (this.selectedsize.id == '')
    {
      this.showMessage('error','Select any size');
      return;
    }
    if (this.selectedtotalcarat <= 0)
    {
      this.showMessage('error','Size total carat can not be less than or equal to zero');
      return;
    }
    if (this.selectednumber.id == '')
    {
      this.showMessage('error','Select any number');
      return;
    }
    if (this.selectedcarat <= 0)
    {
      this.showMessage('error','Number carat can not be less than or equal to zero');
      return;
    }
    if (this.NumberDetails.filter(e => e.sizeId == this.selectedsize.id && e.numberId == this.selectednumber.id).length > 0)
    {
      this.showMessage('error','Selected number exist in selected size.');
      return;
    }
    if (this.SizeDetails.filter(e => e.sizeId == this.selectedsize.id).length == 0){
      this.SizeDetails.push({
        sizeId : this.selectedsize.id,
        sizeName: this.selectedsize.name,
        totalCarat: this.selectedtotalcarat,
        numberDetails: []
      });

      this.summatydata.push({
        sizeId: this.selectedsize.id,
        sizeName : this.selectedsize.name,
        percentage : 0,
        amount : 0,
        totCarat : this.selectedtotalcarat
      });
    }
    else{
      let index = this.SizeDetails.findIndex((item) => item.sizeId === this.selectedsize.id);
      if (index !== -1) {
        this.SizeDetails[index].sizeId = this.selectedsize.id;
        this.SizeDetails[index].sizeName = this.selectedsize.name;
        this.SizeDetails[index].totalCarat = this.selectedtotalcarat;
        this.SizeDetails[index].numberDetails = []
      }

      index = this.summatydata.findIndex((item) => item.sizeId === this.selectedsize.id);
      if (index !== -1) {
        this.summatydata[index].sizeId = this.selectedsize.id;
        this.summatydata[index].sizeName = this.selectedsize.name;
        this.summatydata[index].percentage = 0;
        this.summatydata[index].amount = 0;
        this.summatydata[index].totCarat =  this.selectedtotalcarat;
      }
    }
    var retdata = this.pricelist.filter(e => e.sizeId == this.selectedsize.id && e.numberId == this.selectednumber.id);
      this.NumberDetails.push({
        sizeId : this.selectedsize.id,
        numberId : this.selectednumber.id,
        carat : this.selectedcarat,
        rate : (retdata != null && retdata.length > 0) ? retdata[0].price : 0,
        numberName: this.selectednumber.name,
        amount: this.selectedcarat * ((retdata != null && retdata.length > 0) ? retdata[0].price : 0),
        percentage : (retdata != null && retdata.length > 0) ? (this.selectedcarat / (retdata[0].price)) * 100 : 0
    });
    this.showMessage('success','Items added successfully');
    this.selectednumber = this.numbers.filter(e => e.id == '');
    this.selectedcarat = 0;
    // if (this.selectedsizeonly.findIndex((s: any) => s == this.selectedsize) < 0){
    //   this.selectedsizeonly.push(this.selectedsize);
    // }    
  }
  getItemsBySize(sizeId: string){
    return this.NumberDetails.filter(item => item.sizeId === sizeId);
  }

  deleteitems(item: any){
    if (confirm("Are you sure you want to delete this item?")) {
      var index = this.NumberDetails.indexOf(item);
      if (index >= 0){
        this.NumberDetails.splice(index, 1);
      }
      if (this.NumberDetails.filter(e => e.sizeId == item.sizeId).length == 0){
        var ind = this.SizeDetails.findIndex(e => e.sizeId == item.sizeId);
        if (ind >= 0){
          this.SizeDetails.splice(ind,1);
        }
        var ind1 = this.summatydata.findIndex(e => e.sizeId == item.sizeId);
        if (ind1 >= 0){
          this.summatydata.splice(ind1,1);
        }
      }
      this.calulateSummary();
    }
  }

  viewitem(items: any){
    
    this.date = new Date(items.date);
    this.branchid.id = items.branchId;
    this.branchid.name = items.branchName;
    this.dealerid.id = items.brokerId;
    this.dealerid.name = items.brokerName;
    this.partyid.id = items.partyId;
    this.partyid.name = items.partyName;
    
    this.netcarat = items.netCarat;
    this.note = items.note;
    this.calculatorListData.filter(e => e.srNo == items.srNo && e.companyId == items.companyId && e.branchId == items.branchId &&
        e.financialYearId == items.financialYearId).forEach(e => {
      e.sizeDetails?.forEach(item => {
        this.SizeDetails.push(item);
        this.summatydata.push({
          sizeId: item.sizeId,
          sizeName : item.sizeName,
          percentage : 0,
          amount : 0,
          totCarat : item.totalCarat
        });
        item.numberDetails.forEach(s => {
          this.NumberDetails.push({
            sizeId : s.sizeId,
            numberId : s.numberId,
            carat : s.carat,
            rate : s.rate,
            numberName: s.numberName,
            amount: s.amount,
            percentage : s.percentage
          });
        })
      })
    });
    this.showDetails();
    this.isSaveButton = false;
  }

  public getSizeCaratTotal(sizeId: string): number {
    const sizeTotCarat = this.NumberDetails.filter(item => item.sizeId === sizeId).reduce((acc, curr) => {
      return acc + (+curr.carat);
    }, 0);
    return sizeTotCarat;
  }

  public getSizeAmountTotal(sizeId: string): number {
    const sizeTotCarat = this.NumberDetails.filter(item => item.sizeId === sizeId).reduce((acc, curr) => {
      return acc + (+curr.carat);
    }, 0);
    const sizeTotAmount = this.NumberDetails.filter(item => item.sizeId === sizeId).reduce((acc, curr) => {
      return acc + (+curr.amount);
    }, 0);
    return sizeTotAmount/sizeTotCarat;
  }
  

  saveData(){
    if (this.date == null)
    {
      this.showMessage('error','Select any date');
      return;
    }
    if (this.branchid.id == '')
    {
      this.showMessage('error','Select any branch');
      return;
    }
    if (this.partyid.id == '')
    {
      this.showMessage('error','Select any party');
      return;
    }
    if (this.dealerid.id == '')
    {
      this.showMessage('error','Select any broker');
      return;
    }
    if (this.netcarat <= 0)
    {
      this.showMessage('error','Netcarat can not be less than or equal to zero');
      return;
    }
    if (this.NumberDetails.length == 0)
    {
      this.showMessage('error','Carat item can not be empty');
      return;
    }
    
    if (this.SizeDetails != null && this.SizeDetails.length > 0 && this.NumberDetails != null && this.NumberDetails.length > 0)
    {
      let totCarat: number = 0;
      this.SizeDetails.forEach(e => {
        totCarat = totCarat + (+e.totalCarat);
      }); 
      this.loading = true;    
      if (this.netcarat == totCarat){
        const userId = localStorage.getItem('userid');
        this.SizeDetails.forEach(element => {
          element.numberDetails = this.NumberDetails.filter(e => e.sizeId == element.sizeId);
        });
        if (confirm("Are you sure want to save this item?")){
          const data = {
              Date: this.date,
              CompanyId: this.RememberCompany.company.id,
              FinancialYearId: this.RememberCompany.financialyear.id,
              BranchId: this.branchid.id,
              PartyId: this.partyid.id,
              BrokerId: this.dealerid.id,
              NetCarat: this.netcarat,
              Note: this.note,
              IsDelete: false,
              SizeDetails: this.SizeDetails,
              UserId: userId
          };

          this.sharedService.customPostApi("Calculator/Add",data)
          .subscribe((data: any) => {
                if (data.success == true){                  
                  this.showMessage('success',data.message);
                  this.showAddSection = false;
                  this.showHistory = true;
                  this.showViewSection = false;
                  this.PageTitle = "History";
                 this.clearForm();
                  this.calculatorList();
                }
                else{
                  this.loading = false;
                  this.showMessage('error','Something went wrong...');
                }
              }, (ex: any) => {
                this.loading = false;
                this.showMessage('error',ex);
            });
        }
      }
    }
  }
  onAddIconClick() {
    this.PageTitle = "Add Details"
    debugger;
    this.isSaveButton = true;
    this.getparty();
    this.getdealer();
    this.getbranch();
    this.getsize();
    this.getnumber();
    this.getAllNumberPrice();
    this.showAddSection = true;
    this.showViewSection = false;
    this.showHomeSection = false;
    this.showHistory = false;
  }

  showMessage(type: string, message: string){
    this.messageService.add({severity: type, summary:message});
  }

  clearForm(){
    this.NumberDetails = [];
    this.SizeDetails = [];
    this.summatydata = [];
    this.selectednumber = this.numbers.filter(e => e.id == '');
    this.selectedsize = this.sizes.filter(e => e.Id == '');
    this.selectedcarat = 0;
    this.netcarat = 0;
    this.selectedtotalcarat = 0;
    this.summaryTotAmount = 0;
    this.date = new Date();
    this.branchid = this.branches.filter(e => e.id == '');
    this.partyid = this.party.filter(e => e.id == '');
    this.dealerid = this.dealers.filter(e => e.id == '');
    this.note = '';
    this.loading = false;
  }
}
