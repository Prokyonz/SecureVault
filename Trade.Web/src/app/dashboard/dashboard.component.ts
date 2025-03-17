import { Component, OnInit } from '@angular/core';
import { color } from 'html2canvas/dist/types/css/types/color';
import { user } from '../Model/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  dashBoardReportItems: any[] = [];
  loading: boolean = false;
  userDetails: user;

  constructor() { }

  ngOnInit(): void {
    var userDetail = localStorage.getItem('AuthorizeData');
    if (userDetail) {
      this.userDetails = JSON.parse(userDetail);
    }
    this.getDashBoardData();
  }

  openMenu() {
  }

  onSeach(event: any) {
    console.log(event);
  }

  getDashBoardData(): void {
    this.loading = true;
    this.dashBoardReportItems.push(
      {
        label: '',  // Group label
        visible: true,
        children: [  // Child items under the group
          {
            label: 'Customer',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: "/addcustomer",
            color: '#4CAF50', // Vibrant green for positivity
            index: 1,
            visible: this.hasPermission('CustomerManage')
          },
          {
            label: 'Sale',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: "/sale",
            color: '#FF5722', // Bright orange for dynamic action
            index: 2,
            visible: this.hasPermission('SaleManage')
          }
        ]
      },
      {
        label: 'Report',  // Group label 
        visible: true,
        children: [  // Child items under the group
          {
            label: 'Stock',
            icon: 'pi pi-fw pi-list',
            routerLink: "/report/5",
            color: '#607D8B', // Cool gray-blue for data
            index: 1,
            visible: this.hasPermission('StockReport')
          },
          {
            label: 'Sale',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: "/report/4",
            color: '#E91E63', // Bold pink for emphasis
            index: 2,
            visible: this.hasPermission('SaleReportAccess')
          },
          {
            label: 'Purchase',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: "/report/3",
            color: '#03A9F4', // Calm blue for reliability
            index: 3,
            visible: this.hasPermission('MasterManage')
          },
          {
            label: 'Customer',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: "/report/1",
            color: '#8BC34A', // Fresh green for connection
            index: 4,
            visible: this.hasPermission('CustomerReportAccess')
          },
          {
            label: 'User',
            icon: 'pi pi-fw pi-user',
            routerLink: "/report/2",
            color: '#FFC107', // Energetic yellow for activity
            index: 5,
            visible: this.hasPermission('UserManage')
          }
        ]
      },
      {
        label: 'Master',  // Group label
        visible: this.hasPermission('MasterManage'),
        children: [  // Child items under the group
          {
            label: 'User',
            icon: 'pi pi-fw pi-user',
            routerLink: "/user",
            color: '#FF9800', // Warm orange for priority
            index: 1,
            visible: this.hasPermission('UserManage')
          },
          {
            label: 'Purchase',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: "/purchase",
            color: '#3F51B5', // Solid blue for trust
            index: 2,
            visible: this.hasPermission('MasterManage')
          },
          {
            label: 'Item',
            icon: 'pi pi-fw pi-box',
            routerLink: "/additem",
            color: '#673AB7', // Rich purple for creativity
            index: 3,
            visible: this.hasPermission('MasterManage')
          },
          {
            label: 'POS',
            icon: 'pi pi-fw pi-credit-card',
            routerLink: "/pos",
            color: '#009688', // Teal for technology
            index: 4,
            visible: this.hasPermission('MasterManage')
          },
          {
            label: 'Series',
            icon: 'pi pi-fw pi-tag',
            routerLink: "/series",
            color: '#795548', // Earthy brown for categorization
            index: 5,
            visible: this.hasPermission('MasterManage')
          }
        ]
      });
    this.loading = false;
  }

  hasPermission(permissionKey: string): boolean {
    if (this.userDetails?.isAdmin) {
      return true;
    }
    else {
      return this.userDetails.permissions.some(permission => permission.keyName === permissionKey);
    }
  }
}
