import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../common/shared.service';

interface Company {
  name: string;
  id: string;
}

interface Branch{
  name: string;
  id: string;
}

interface FinancialYear{
  name: string;
  id: string;
}

export class RememberCompany{
  company : Company;
  branch: Branch;
  financialyear: FinancialYear;
  rememberme: string;
}

@Component({
  selector: 'app-companyselection',
  templateUrl: './companyselection.component.html',
  styleUrls: ['./companyselection.component.scss']
})
export class CompanyselectionComponent {
  companies: Company[];

  selectedCity: Company;

  showHeaderForCompanySelect: boolean = false;

  Company : Company[] = [];
  Branch : Branch[] = []
  FinancialYear : FinancialYear[] = []

  SelectedCompany : Company;
  SelectedBranch : Branch;
  SelectedFinancialYear : FinancialYear;

  RememberCompany : RememberCompany = new RememberCompany();

  constructor(private router: Router, private activateRoute: ActivatedRoute, private sharedService: SharedService){}

  rememberMe : boolean = false;

  ngOnInit() {
      this.showHeaderForCompanySelect = this.activateRoute.snapshot?.params['value'] == "header" ? true : false;
      this.getCompany();
      this.getBranch();
      this.getFinancialYear();
      debugger;
      var data = localStorage.getItem('companyremember');
      if (data != null){
        var companyData = JSON.parse(data);
        if (companyData.rememberme == "true"){
          this.SelectedCompany = companyData.company;
          this.SelectedBranch = companyData.branch;
          this.SelectedFinancialYear = companyData.financialyear;
          this.rememberMe = true
        }
        else{
          this.rememberMe = false
        }
      }
  }

  getCompany(){
    this.sharedService.customGetApi("Service/GetAllCompany").subscribe((t) => {
      if (t.success == true){
        if (t.data != null && t.data.length > 0){         
          this.Company = t.data;
        }
      }
    });      
  }

  getBranch(){
    this.sharedService.customGetApi("Service/GetAllBranch").subscribe((t) => {
      if (t.success == true){
        if (t.data != null && t.data.length > 0){          
          this.Branch = t.data;
        }
      }
    });      
  }

  getFinancialYear(){
    this.sharedService.customGetApi("Service/GetAllFinancialYear").subscribe((t) => {
      if (t.success == true){
        if (t.data != null && t.data.length > 0){          
          this.FinancialYear = t.data;
        }
      }
    });      
  }

  handleCompany(event: any){
    this.SelectedCompany = event.value;
  }

  handleBranch(event: any){
    this.SelectedBranch = event.value;
  }

  handleAccountYear(event: any){
    this.SelectedFinancialYear = event.value;
  }

  onSaveCompanySelection() {
    debugger;
    if (this.rememberMe){
      debugger;
      this.RememberCompany.company = this.SelectedCompany;
      this.RememberCompany.branch = this.SelectedBranch;
      this.RememberCompany.financialyear  = this.SelectedFinancialYear;
      this.RememberCompany.rememberme = this.rememberMe.toString();
      localStorage.setItem("companyremember", JSON.stringify(this.RememberCompany));
    }
    else{
      localStorage.removeItem("companyremember");
    }
    this.router.navigate(['/dashboard']);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
