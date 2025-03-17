import { Component, Input } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MessageService } from 'primeng/api';
import { SharedService } from 'src/app/common/shared.service';
import { saleBillPrint } from 'src/app/Model/models';

@Component({
  selector: 'app-sale-print',
  templateUrl: './sale-print.component.html',
  styleUrls: ['./sale-print.component.scss']
})
export class SalePrintComponent {
  loading = false;
  isMobile: boolean = false;
  saleBillPrint: saleBillPrint;
  paymentRowSpan: number = 1;
  @Input() billId: number = 0;
  @Input() includeMobile: boolean = true;
  @Input() includeEmail: boolean = true;

  constructor(private sharedService: SharedService, private messageService: MessageService) {

  }

  ngOnInit(): void {
    this.checkIfMobile();
    if (this.billId > 0) {
      this.getSaleBillPrint(this.billId.toString());
    }
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;  // Adjust the width as needed
  }

  getSaleBillPrint(salesId: string) {
    this.loading = true;
    this.sharedService.customGetApi1<saleBillPrint>('Sales/SaleBillPrint/' + salesId).subscribe(
      (data: any) => {
        this.saleBillPrint = data;
        this.paymentRowSpan = this.saleBillPrint?.saleBillPayments?.length;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.showMessage('Error fetching Sale Bill details:', error);
      }
    );
  }

  showMessage(type: string, message: string) {
    this.messageService.add({ severity: type, summary: message });
  }

  async sharePDF() {
    this.loading = true;
    setTimeout(async () => {
      const element = document.getElementById('content-to-export');
      if (element) {
        // Set the element's dimensions explicitly to ensure full capture
        const originalWidth = element.offsetWidth;
        const originalHeight = element.offsetHeight;

        html2canvas(element, {
          scale: 2, // Increases the resolution of the canvas
          scrollY: 0, // Ensures no content is missed due to scrolling
          scrollX: 0,
          width: originalWidth, // Full width of the element
          height: originalHeight, // Full height of the element
        }).then(async (canvas) => {
          // Create a new jsPDF instance
          const pdf = new jsPDF('p', 'mm', 'a4', true); // Portrait, millimeters, A4 size

          // Get element dimensions in millimeters for PDF scaling
          const pageWidth = 210; // A4 width in mm
          const pageHeight = 297; // A4 height in mm
          const imgWidth = pageWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          let position = 0;

          // If the content height exceeds the page height, paginate
          if (imgHeight > pageHeight) {
            let remainingHeight = imgHeight;
            while (remainingHeight > 0) {
              pdf.addImage(
                canvas.toDataURL('image/png', 0.7),
                'PNG',
                0,
                position,
                imgWidth,
                Math.min(remainingHeight, pageHeight)
              );
              remainingHeight -= pageHeight;
              position -= pageHeight;
              if (remainingHeight > 0) pdf.addPage();
            }
          } else {
            // Single page
            pdf.addImage(canvas.toDataURL('image/png', 0.7), 'PNG', 0, 0, imgWidth, imgHeight);
          }

          // Convert PDF to blob for mobile handling
          const pdfBlob = pdf.output('blob');

          // Use Capacitor Filesystem to save the PDF on the device
          const fileName = this.saleBillPrint.invoiceNo + '.pdf';
          if (!this.isMobile) {
            pdf.save(fileName);
            this.loading = false;
          }
          else {
            const requestPermissions = async () => {
              const permissionStatus = await Filesystem.requestPermissions();
              console.log('Permission requested:', permissionStatus);
              return permissionStatus.publicStorage === 'granted';
            };
            Filesystem.writeFile({
              path: fileName,
              data: await this.convertBlobToBase64(pdfBlob),
              directory: Directory.Cache,//Directory.Documents, // Save to documents directory
              //encoding: Encoding.UTF8,
            })
              .then(async (writeFileResult) => {
                const fileUri = await Filesystem.getUri({
                  directory: Directory.Cache,
                  path: fileName,
                });
                // On success, share the PDF file
                try {
                  // Attempt to share the PDF file (this will open the native sharing options, including PDF viewer)
                  await Share.share({
                    title: 'Invoice PDF',
                    text: 'Here is your invoice.',
                    url: fileUri.uri,//writeFileResult.uri,
                    dialogTitle: 'Share PDF',
                  });
                  this.loading = false;
                } catch (err) {
                  console.error('Error sharing PDF:', err);
                  this.loading = false;
                }
              })
              .catch((error) => {
                console.error('Error writing file to device', error);
                this.loading = false;
              });
          }
        });
      }
    }, 500);
  }

  // Helper function to convert blob to base64 for saving the PDF
  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }
}
