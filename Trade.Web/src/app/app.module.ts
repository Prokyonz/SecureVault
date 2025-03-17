import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { Card, CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CalculatorComponent } from './calculator/calculator.component';
import { AddctsComponent } from './calculator/addcts/addcts.component';
import { ViewctsComponent } from './calculator/viewcts/viewcts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PanelModule } from 'primeng/panel';
import { HeaderComponent } from './shared/component/header/header.component';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedService } from './common/shared.service';
import { AuthService } from './auth.service';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReportComponent } from './report/report.component';
import { FilterbarComponent } from './shared/component/filterbar/filterbar.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { CompanyselectionComponent } from './shared/component/companyselection/companyselection.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { UploadComponent } from './shared/component/upload/upload.component';
import { DialogModule } from 'primeng/dialog';
import { ViewcustomerComponent } from './customer/viewcustomer/viewcustomer.component';
import { AddcustomerComponent } from './customer/addcustomer/addcustomer.component';
import { SaleComponent } from './sale/sale.component';
import { AdditemComponent } from './master/item/additem/additem.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { UserComponent } from './user/user.component';
import { SaleBillComponent } from './sale/sale-bill/sale-bill.component';
import { PosComponent } from './master/pos/pos.component';
import { SeriesComponent } from './master/series/series.component';
import { SalePrintComponent } from './sale/sale-print/sale-print.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CalculatorComponent,
    AddctsComponent,
    ViewctsComponent,
    DashboardComponent,
    HeaderComponent,
    ReportComponent,
    FilterbarComponent,
    CompanyselectionComponent,
    UploadComponent,
    ViewcustomerComponent,
    AddcustomerComponent,
    SaleComponent,
    AdditemComponent,
    PurchaseComponent,
    UserComponent,
    SaleBillComponent,
    PosComponent,
    SeriesComponent,
    SalePrintComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ReactiveFormsModule,
    MessageModule,
    CardModule,
    MenubarModule,
    MenuModule,
    CalendarModule,
    DropdownModule,
    PanelModule,
    SidebarModule,
    PanelMenuModule,
    ToastModule,
    TableModule,
    InputTextareaModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    RadioButtonModule,
    CheckboxModule,
    ProgressSpinnerModule,
    DialogModule,
    MultiSelectModule
  ],
  providers: [SharedService, AuthService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
