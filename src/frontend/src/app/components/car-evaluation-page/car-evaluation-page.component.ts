import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PredictionService } from '../../services/prediction.service';
import { CarFormValue, Prediction, PredictionResult } from '../../models/car';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '@auth0/auth0-angular';
import { ListPredictionsComponent } from '../list-predictions/list-predictions.component';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-car-evaluation-page',
  templateUrl: './car-evaluation-page.component.html',
  styleUrls: ['./car-evaluation-page.component.css'],
  animations: [
    trigger('fadeInOut', [transition(':enter', [style({ opacity: 0 }), animate('300ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))])])
  ]
})
export class CarEvaluationPageComponent implements OnInit, OnDestroy{
  loading = false;
  result: PredictionResult | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  input: CarFormValue | null = null;
  userEmail: string | null = null;
  model: boolean | null = null;

  @ViewChild(ListPredictionsComponent) listComp?: ListPredictionsComponent;

  private modelCheck?: Subscription;

  constructor(private pred: PredictionService, public auth: AuthService) {}
  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.userEmail = user?.email || null;
    });

    // Controllo periodico del modello ogni minuto
    this.modelCheck = interval(10000).subscribe(() => this.verify_model());
    this.verify_model();
  }

  ngOnDestroy(): void {
    this.modelCheck?.unsubscribe();
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 5000);
  }

  verify_model(){
    this.pred.isModel().subscribe({
      next: () => {
          this.model = true;
          this.modelCheck?.unsubscribe();
      }, error: () =>{
        this.model = false
      }
    });
  }

  onEvaluate(value: CarFormValue) {
    this.loading = true;
    this.result = null;
    this.pred.predict(value).subscribe({
      next: (ris) => {
      this.result = ris;
      this.loading = false;
      this.input = value;
      },
      error: (err) => {
        this.showError('Errore nella predizione');
      }
    });
    this.loading = false;
    
  }


  savePrediction() {
    if (!this.result || !this.input) return;

    const s: Prediction = {
      'user_email': this.userEmail,
      'buying': this.input.buying,
      'maint': this.input.maint,
      'doors': this.input.doors,
      'persons': this.input.persons,
      'lug_boot': this.input.lug_boot,
      'safety': this.input.safety,
      'class': this.result.prediction
    };

    this.pred.addPrediction(s).subscribe({
      next: () => {
        this.showSuccess('✅ Predizione salvata con successo');
        this.listComp?.loadPredictions();
      },
      error: (err) => {
        this.showError('Errore nel salvataggio della predizione');
      }
    });
  }
}
