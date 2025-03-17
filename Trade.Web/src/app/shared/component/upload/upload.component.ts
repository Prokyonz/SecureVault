import { Component } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  selectedFile: File | null = null;
  imageUrl: string | null = null; // To hold the image URL

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      debugger
      this.selectedFile = target.files[0];
      this.onUpload();
    }
  }

  onUpload(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Convert ArrayBuffer to binary string
        const arrayBuffer = e.target.result as ArrayBuffer;
        const binaryData = new Uint8Array(arrayBuffer);
        this.imageUrl = this.arrayBufferToBase64(binaryData); // Convert to base64
      };
      reader.readAsArrayBuffer(this.selectedFile); // Read the file as ArrayBuffer
    }
  }

  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return 'data:image/jpeg;base64,' + btoa(binary); // Add the appropriate MIME type
  }
}
