import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { MessageService } from 'primeng/api';
import { SharedService } from 'src/app/common/shared.service';
import { Customer } from 'src/app/Model/models';

@Component({
  selector: 'app-addcustomer',
  templateUrl: './addcustomer.component.html',
  styleUrls: ['./addcustomer.component.scss'],
  providers: [MessageService]
})
export class AddcustomerComponent implements OnInit {
  PageTitle: string = "Add Customer";
  isUploadVisible = false;
  isSaveButton: boolean = true;
  loading: boolean = false;
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  currentDocumentType: string = '';
  isEditMode = false;
  logInUserID: string;
  // customerDetails = {
  //   name: '',
  //   address: '',
  //   mobile: '',
  //   email: '',
  //   aadhar: '',
  //   pancard: '',
  //   imageAadharcardFront: '',
  //   imageAadharcardBack: '',
  //   imagePancard: '',
  //   imageSignature: '',
  // };
  customerDetails: Customer;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private messageService: MessageService, private sharedService: SharedService) {
    this.customerDetails = new Customer();
    this.logInUserID = localStorage.getItem('userid') ?? '0';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const itemId = params.get('id'); // Assuming 'id' is the parameter name in your route

      if (itemId) {
        this.isEditMode = true;
        this.loadItem(itemId); // Fetch the item by ID if editing
      }
    });
  }

  loadItem(customerId: string) {
    this.loading = true;
    this.sharedService.customGetApi1<Customer[]>('Customer/GetCustomer/' + customerId).subscribe(
      (data: any) => {
        this.customerDetails = data;
        this.isEditMode = true;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.showMessage('Error fetching customer details:', error);
      }
    );
  }

  myfunction() {
    if (!this.isSaveButton) {
      this.isSaveButton = true;
      this.PageTitle = "History";
      this.clearForm();
    }
    else {
      this.router.navigate(["dashboard"]);
    }
  }

  // Show upload component method
  showUploadComponent() {
    this.isUploadVisible = true;
  }

  // Show details method
  showDetails() {
    var msg = '';
    if (this.customerDetails.aadharImageFrontData === '') {
      msg += ' Aadharcard Front Image,';
    }
    if (this.customerDetails.aadhbarImageBackData === '') {
      msg += ' Aadharcard Back Image,';
    }
    if (this.customerDetails.panImageData === '') {
      msg += ' Pancard Image,';
    }
    // if (this.customerDetails.signatureImageData === '') {
    //   msg += ' Signature Image,';
    // }

    if (msg.length > 0) {
      msg = msg.substring(0, msg.length - 1) + ' is required.';
      this.showMessage('error', msg);
      return;
    }

    if (this.isEditMode) {
      this.updateItem();
    } else {
      this.createItem();
    }
  }

  createItem() {
    this.loading = true;
    this.customerDetails.aadharNo = this.customerDetails.aadharNo.toString();
    this.customerDetails.panNo = this.customerDetails.panNo.toString();
    this.customerDetails.mobileNo = this.customerDetails.mobileNo.toString();
    this.customerDetails.createdBy = parseInt(this.logInUserID);
    this.customerDetails.createdDate = new Date();
    this.customerDetails.updatedBy = parseInt(this.logInUserID);
    this.customerDetails.updatedDate = new Date();
    this.sharedService.customPostApi("Customer", this.customerDetails)
      .subscribe((data: any) => {
        if (data != null) {
          this.loading = false;
          this.showMessage('success', 'Customer details added successfully');
          this.clearForm();
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
    this.loading = true;
    this.customerDetails.aadharNo = this.customerDetails.aadharNo.toString();
    this.customerDetails.panNo = this.customerDetails.panNo.toString();
    this.customerDetails.mobileNo = this.customerDetails.mobileNo.toString();
    this.customerDetails.updatedBy = parseInt(this.logInUserID);
    this.customerDetails.updatedDate = new Date();
    this.sharedService.customPutApi("Customer", this.customerDetails)
      .subscribe((data: any) => {
        if (data != null) {
          this.loading = false;
          this.showMessage('success', 'Customer details updated successfully');
          this.clearForm();
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

  isFormValid() {
    return this.customerDetails.firstName && this.customerDetails.mobileNo;
  }

  clearForm() {
    this.isEditMode = false;
    this.loading = false;
    this.customerDetails = new Customer();
  }

  triggerFileInput(documentType: string) {
    this.currentDocumentType = documentType;
    this.imageUrl = '';
    if (this.currentDocumentType == 'AadharcardFront' && this.customerDetails.aadharImageFrontData != '') {
      this.imageUrl = this.customerDetails.aadharImageFrontData;
      this.isUploadVisible = true;
      return;
    }
    else if (this.currentDocumentType == 'AadharcardBack' && this.customerDetails.aadhbarImageBackData != '') {
      this.imageUrl = this.customerDetails.aadhbarImageBackData;
      this.isUploadVisible = true;
      return;
    }
    else if (this.currentDocumentType == 'Pancard' && this.customerDetails.panImageData != '') {
      this.imageUrl = this.customerDetails.panImageData;
      this.isUploadVisible = true;
      return;
    }
    else if (this.currentDocumentType == 'Signature' && this.customerDetails.signatureImageData != '') {
      this.imageUrl = this.customerDetails.signatureImageData;
      this.isUploadVisible = true;
      return;
    }
    this.onUpload(false);
    // const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    // fileInput.click();
  }

  onFileSelected(event: Event): void {
    // const target = event.target as HTMLInputElement;
    // if (target.files && target.files.length) {
    //   this.selectedFile = target.files[0];
    //   this.onUpload(false);
    //   this.isUploadVisible = true;
    // }
    this.onUpload(false);
    this.isUploadVisible = true;
  }

  onUpload(isUpload: boolean): void {
    //if (this.selectedFile) {
    // Using Capacitor Camera to either take a photo or pick from gallery
    Camera.getPhoto({
      resultType: CameraResultType.Uri, // We will use the URI for the image
      source: CameraSource.Prompt, // Prompt user to choose between Camera or Gallery
      quality: 100, // Optional: Adjust image quality
      allowEditing: false, // Optional: Set to true if you want users to edit the image
      // width: 600, // Optional: Set image width
      // height: 600, // Optional: Set image height
    }).then((photo) => {
      // Convert the image URI to base64
      this.convertUriToBase64(photo.webPath!).then(base64Data => {
        this.imageUrl = base64Data; // Store the base64 string

        // Handle the upload logic based on the current document type

        if (this.currentDocumentType == 'AadharcardFront') {
          this.customerDetails.aadharImageFrontData = this.imageUrl;
        } else if (this.currentDocumentType == 'AadharcardBack') {
          this.customerDetails.aadhbarImageBackData = this.imageUrl;
        } else if (this.currentDocumentType == 'Pancard') {
          this.customerDetails.panImageData = this.imageUrl;
        } else if (this.currentDocumentType == 'Signature') {
          this.customerDetails.signatureImageData = this.imageUrl;
        }
        if (isUpload) {
          this.isUploadVisible = false;
        }
        else {
          this.isUploadVisible = true;
        }
      }).catch((error) => {
        console.error('Error converting URI to base64:', error);
      });
    }).catch((error) => {
      console.error('Error picking photo:', error);
    });
    //}
  }

  // Helper function to convert image URI to base64 string
  async convertUriToBase64(uri: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Convert to base64
    });
  }

  // onUpload(isUpload: boolean): void {
  //   if (this.selectedFile) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       // Convert ArrayBuffer to binary string
  //       const arrayBuffer = e.target.result as ArrayBuffer;
  //       const binaryData = new Uint8Array(arrayBuffer);
  //       this.imageUrl = this.arrayBufferToBase64(binaryData); // Convert to base64

  //       if (isUpload) {
  //         if (this.currentDocumentType == 'AadharcardFront') {
  //           this.customerDetails.aadharImageFrontData = this.imageUrl;
  //         }
  //         else if (this.currentDocumentType == 'AadharcardBack') {
  //           this.customerDetails.aadhbarImageBackData = this.imageUrl;
  //         }
  //         else if (this.currentDocumentType == 'Pancard') {
  //           this.customerDetails.panImageData = this.imageUrl;
  //         }
  //         else if (this.currentDocumentType == 'Signature') {
  //           this.customerDetails.signatureImageData = this.imageUrl;
  //         }
  //         this.isUploadVisible = false;
  //       }
  //     };
  //     reader.readAsArrayBuffer(this.selectedFile); // Read the file as ArrayBuffer
  //   }
  // }

  // arrayBufferToBase64(buffer: Uint8Array): string {
  //   let binary = '';
  //   const len = buffer.byteLength;
  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(buffer[i]);
  //   }
  //   return 'data:image/jpeg;base64,' + btoa(binary); // Add the appropriate MIME type
  // }

  onDialogClose() {
    this.isUploadVisible = false;
  }

  showMessage(type: string, message: string) {
    this.messageService.add({ severity: type, summary: message });
  }
}
