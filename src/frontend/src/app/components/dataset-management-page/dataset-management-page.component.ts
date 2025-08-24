import { Component, OnInit } from '@angular/core';
import { DatasetService } from '../../services/dataset.service';
import { Dataset } from '../../models/dataset';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-dataset-management-page',
  templateUrl: './dataset-management-page.component.html',
  styleUrls: ['./dataset-management-page.component.css'],
  animations: [
    trigger('fadeInOut', [transition(':enter', [style({ opacity: 0 }), animate('300ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))])])
  ]
})
export class DatasetManagementPageComponent implements OnInit {
  dataset: Dataset | null = null;
  errorMessage: string | null = null;
  uploading = false;

  constructor(private ds: DatasetService) {}

  ngOnInit(): void {
    this.loadMetadata();
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  
  loadMetadata() {
    this.ds.getDatasetMetadata().subscribe({
      next: (data) => {
        this.dataset = data;
      }, error: () => this.showError('Errore nel caricamento delle informazioni sul dataset.')
    });
  }

  onFileDropped(file: File) {
    this.uploading = true;
    this.ds.uploadDataset(file).subscribe({
      next: (data) => {
        console.log(data)
        this.uploading = false;
        this.dataset = null;
        setTimeout(() => {
          this.loadMetadata();
        }, 5000);
      },
      error: (err) => {
        this.uploading = false;
        this.showError('Upload non riuscito');
      }
    });
  }
}
