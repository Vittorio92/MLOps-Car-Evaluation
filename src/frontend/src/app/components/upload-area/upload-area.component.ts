import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload-area',
  templateUrl: './upload-area.component.html',
  styleUrls: ['./upload-area.component.css']
})
export class UploadAreaComponent {

  @Output() fileDropped = new EventEmitter<File>();
  dragOver = false;

  private isValidFile(file: File): boolean {
    const extensions = ['.csv', '.data'];
    return extensions.some(ext => file.name.toLowerCase().endsWith(ext));
  }

  onDragOver(ev: DragEvent) {
    ev.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(ev: DragEvent) {
    ev.preventDefault();
    this.dragOver = false;
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.dragOver = false;
    const files = ev.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files.item(0) as File;
      if (this.isValidFile(file)) {
        this.fileDropped.emit(file);
      } else {
        alert("Sono ammessi solo file .csv o .data.");
      }
    }
  }


  onFileSelected(ev: Event) {
  const input = ev.target as HTMLInputElement;
  if (input.files && input.files.length) {
    const file = input.files.item(0) as File;
    if (this.isValidFile(file)) {
      this.fileDropped.emit(file);
    } else {
      alert("Sono ammessi solo file .csv o .data.");
    }
  }
}
}

