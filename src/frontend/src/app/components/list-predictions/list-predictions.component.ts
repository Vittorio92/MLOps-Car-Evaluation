import { Component, OnInit } from '@angular/core';
import { ListPredictionResponse, sPrediction } from 'src/app/models/car';
import { AuthService } from '@auth0/auth0-angular';
import { PredictionService } from 'src/app/services/prediction.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-list-predictions',
  templateUrl: './list-predictions.component.html',
  styleUrls: ['./list-predictions.component.css'],
    animations: [
      trigger('fadeInOut', [transition(':enter', [style({ opacity: 0 }), animate('300ms ease-in', style({ opacity: 1 }))]),
        transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))])])
    ]
})
export class ListPredictionsComponent implements OnInit {

  predictions: sPrediction[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  selectedClass: string = '';
  userEmail: any;
  response: ListPredictionResponse | null = null
  errorMessage: string | null = null;


  constructor(private predSer: PredictionService, public auth: AuthService) {}


  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.userEmail = user?.email || null;
      if (this.userEmail) {
        this.loadPredictions();
      }
    });
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }


  loadPredictions(): void {
    if (!this.userEmail) return;

    this.predSer.getPredictions(this.userEmail, this.currentPage, this.selectedClass).subscribe({
      next: (data) =>{
        this.response =data;
        this.predictions = this.response.predictions;
        this.totalPages = this.response.total_pages;
      }, error: () => this.showError("Errore nel prendere la lista di predizioni")
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPredictions();
    }
  }

  applyFilter(): void {
    this.currentPage = 1;
    this.loadPredictions();
  }


  deletePrediction(prediction: sPrediction) {
    if (!confirm('Confirm?')) return;
    this.predSer.deletePrediction(prediction.id).subscribe({
      next: () => {
        this.loadPredictions();
      },
      error: (err) => {
        this.showError("Errore nell'eliminare la predizione")
      }
    });
  }

}
