import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { user } from 'src/app/Model/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @Input() title: string = "MyHeader";
  @Input() iconName: string = "pi-align-justify";
  @Input() leftIconName: string = "pi-align-justify";
  @Input() showSideBar: boolean = false;
  @Output() onClickMainIcon = new EventEmitter();
  @Output() onClickLeftIcon = new EventEmitter();
  username: string = 'Demo User';
  sidebarVisible!: boolean;
  userDetails: user;
  items: MenuItem[] = [];
  filteredItems: MenuItem[] = [];

  ngOnInit(): void {
    var userDetail = localStorage.getItem('AuthorizeData');
    if (userDetail) {
      this.userDetails = JSON.parse(userDetail);
      this.username = this.userDetails.firstName + ' ' + this.userDetails.lastName;
    }

    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: "/dashboard",
        command: () => {
          this.sidebarVisible = false;
        },
        visible: true
      },
      {
        label: 'Customer',
        icon: 'pi pi-fw pi-user-plus',
        routerLink: "/addcustomer",
        expanded: false,
        command: () => {
          this.sidebarVisible = false;
        },
        visible: this.hasPermission('CustomerManage')
      },
      {
        label: 'Sale',
        icon: 'pi pi-fw pi-chart-line',
        routerLink: "/sale",
        expanded: false,
        command: () => {
          this.sidebarVisible = false;
        },
        visible: this.hasPermission('SaleManage')
      },
      {
        label: 'Reports',
        expanded: true,
        visible: true,
        items: [
          {
            label: 'Stock',
            icon: 'pi pi-fw pi-list',
            routerLink: "/report/5",
            command: () => {
              this.sidebarVisible = false;
            },
            visible: this.hasPermission('StockReport')
          },
          {
            label: 'Sale',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: "/report/4",
            command: () => {
              this.sidebarVisible = false;
            },
            visible: this.hasPermission('SaleReportAccess')
          },
          {
            label: 'Purchase',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: "/report/3",
            command: () => {
              this.sidebarVisible = false;
            },
            visible: this.hasPermission('MasterManage')
          },
          {
            label: 'Customer',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: "/report/1",
            command: () => {
              this.sidebarVisible = false;
            },
            visible: this.hasPermission('CustomerReportAccess')
          },
          {
            label: 'User',
            icon: 'pi pi-fw pi-user',
            routerLink: "/report/2",
            command: () => {
              this.sidebarVisible = false;
            },
            visible: this.hasPermission('UserManage')
          }
        ]
      },
      {
        label: 'Master',
        expanded: true,
        visible: this.hasPermission('MasterManage'),
        items: [
          {
            label: 'User',
            icon: 'pi pi-fw pi-user',
            routerLink: "/user",
            command: () => {
              this.sidebarVisible = false;
            },
            visible: this.hasPermission('UserManage')
          },
          {
            label: 'Purchase',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: "/purchase",
            command: () => {
              this.sidebarVisible = false;
            },
            visible: this.hasPermission('MasterManage')
          },
          {
            label: 'Item',
            icon: 'pi pi-fw pi-box',
            routerLink: "/additem",
            command: () => {
              this.sidebarVisible = false;
            },
            visible: this.hasPermission('MasterManage')
          },
          {
            label: 'POS',
            icon: 'pi pi-fw pi-credit-card',
            routerLink: "/pos",
            command: () => {
              this.sidebarVisible = false;
            },
            visible: this.hasPermission('MasterManage')
          },
          {
            label: 'Series',
            icon: 'pi pi-fw pi-tag',
            routerLink: "/series",
            command: () => {
              this.sidebarVisible = false;
            },
            visible: this.hasPermission('MasterManage')
          }
        ]
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
        routerLink: "/login",
        command: () => {
          this.sidebarVisible = false;
        },
        visible: true
      }
    ];

    this.filteredItems = this.filterVisibleItems(this.items);
  }

  hasPermission(permissionKey: string): boolean {
    if (this.userDetails?.isAdmin) {
      return true;
    }
    else {
      return this.userDetails.permissions.some(permission => permission.keyName === permissionKey);
    }
  }

  filterVisibleItems(items: MenuItem[]): MenuItem[] {
    return items
      .filter(item => item.visible) // Keep items with visible: true
      .map(item => {
        // Recursively filter child items
        if (item.items) {
          return {
            ...item,
            items: this.filterVisibleItems(item.items)
          };
        }
        return item;
      });
  }

  iconClick() {
    this.sidebarVisible = this.showSideBar;
    this.onClickMainIcon.emit();
  }

  leftIconClick() {
    this.onClickLeftIcon.emit();
  }
}