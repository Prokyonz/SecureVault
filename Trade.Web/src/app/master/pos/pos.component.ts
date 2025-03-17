import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'src/app/common/shared.service';
import { item, pos } from 'src/app/Model/models';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent {
  PageTitle = 'POS Details';
  posItem: pos;
  loading: boolean = false;
  isSaveButton: boolean = false;
  isEditMode = false;
  posItemData: pos[];
  logInUserID: string;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private messageService: MessageService, private sharedService: SharedService) {
    this.posItem = new pos();
    this.logInUserID = localStorage.getItem('userid') ?? '0';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const itemId = params.get('posId'); // Assuming 'id' is the parameter name in your route

      if (itemId) {
        this.isEditMode = true;
        this.isSaveButton = true;
        this.loadItem(itemId); // Fetch the item by ID if editing
      } else {
        this.isEditMode = false;
        this.getItem();
      }
    });
  }

  loadItem(posId: string) {
    this.loading = true;
    this.sharedService.customGetApi1<item[]>('POSMaster/GetPOSMaster/' + posId).subscribe(
      (data: any) => {
        this.posItem = data; // Data is directly returned here as an array of User objects
        this.isEditMode = true;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.showMessage('Error fetching pos details:', error);
      }
    );
  }

  myfunction() {
    if (this.isSaveButton) {
      this.isSaveButton = false;
      this.PageTitle = "POS Details";
      this.clearForm();
      this.router.navigate(["pos"]);
    }
    else {
      this.router.navigate(["dashboard"]);
    }
  }

  onAddIconClick() {
    this.PageTitle = "Add POS"
    this.isSaveButton = true;
  }

  getItem() {
    this.loading = true;
    this.sharedService.customGetApi1<pos[]>('POSMaster').subscribe(
      (data: pos[]) => {
        this.posItemData = data; // Data is directly returned here as an array of User objects
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.showMessage('Error fetching pos details:', error);
      }
    );
  }

  // Function to handle the form submission
  showDetails() {
    if (this.posItem.tidBankName.length == 0) {
      this.showMessage('error', 'Please enter POS Bank Name');
      return;
    }

    if (this.isEditMode) {
      this.updateItem();
    } else {
      this.createItem();
    }
    this.router.navigate(['/pos']);
  }

  createItem() {
    this.sharedService.customPostApi("POSMaster", this.posItem)
      .subscribe((data: any) => {
        if (data != null) {
          this.showMessage('success', 'POS Save Successfully');
          this.clearForm();
          this.getItem();
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
    this.sharedService.customPutApi("POSMaster", this.posItem)
      .subscribe((data: any) => {
        if (data != null) {
          this.showMessage('success', 'POS Updated Successfully');
          this.clearForm();
          this.getItem();
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

  deleteItem(item: any) {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      this.sharedService.customDeleteApi('POSMaster/' + item.id).subscribe(
        (response: any) => {
          this.showMessage('success', 'Item Deleted Successfully');
          this.getItem();
        },
        (error) => {
          this.showMessage('error', 'Something went wrong...');
        }
      );
    }
  }

  showMessage(type: string, message: string) {
    this.messageService.add({ severity: type, summary: message });
  }

  clearForm() {
    this.posItem = new pos();
    this.isEditMode = false;
    this.isSaveButton = false;
    this.loading = false;
  }

  onCheckChange(event: any, item: any): void {
    this.loading = true;
    if (this.posItem) {
      item.updatedBy = this.logInUserID;
      item.updatedDate = new Date();
      this.sharedService.customPutApi("POSMaster/ActivePOS", item)
        .subscribe((data: any) => {
          if (data != null) {
            if (event.checked) {
              this.showMessage('success', `${item.tidNumber} is now active.`);
            } else {
              this.showMessage('success', `${item.tidNumber} is now inactive.`);
            }
            this.loading = false;
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
  }
}
