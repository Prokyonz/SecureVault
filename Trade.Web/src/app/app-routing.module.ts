import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AddctsComponent } from './calculator/addcts/addcts.component';
import { ViewctsComponent } from './calculator/viewcts/viewcts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { ReportComponent } from './report/report.component';
import { CompanyselectionComponent } from './shared/component/companyselection/companyselection.component';
import { AddcustomerComponent } from './customer/addcustomer/addcustomer.component';
import { SaleComponent } from './sale/sale.component';
import { AdditemComponent } from './master/item/additem/additem.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { UserComponent } from './user/user.component';
import { SaleBillComponent } from './sale/sale-bill/sale-bill.component';
import { PosComponent } from './master/pos/pos.component';
import { SeriesComponent } from './master/series/series.component';
import { SalePrintComponent } from './sale/sale-print/sale-print.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'login',component:LoginComponent},
  {path:'dashboard', component:DashboardComponent},
  {path:'addcustomer', component:AddcustomerComponent},
  {path:'addcustomer/:id', component:AddcustomerComponent},
  {path:'additem', component:AdditemComponent},
  {path:'additem/:itemId', component:AdditemComponent},
  {path:'pos', component:PosComponent},
  {path:'pos/:posId', component:PosComponent},
  {path:'series', component:SeriesComponent},
  {path:'series/:seriesId', component:SeriesComponent},
  {path:'sale', component:SaleComponent},
  {path:'sale/:salesId', component:SaleComponent},
  {path:'salebill/:salesId', component:SaleBillComponent},
  {path:'salebillprint/:salesId', component:SalePrintComponent},
  {path:'purchase', component:PurchaseComponent},
  {path:'purchase/:purchaseId', component:PurchaseComponent},
  {path:'user', component:UserComponent},
  {path:'user/:id', component:UserComponent},
  {path:'addcts', component:AddctsComponent},
  {path:'viewcts', component:ViewctsComponent},
  {path:'calculator', component: CalculatorComponent},
  {path:'report/:id', component: ReportComponent},
  {path:'companyselection/:value', component: CompanyselectionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
