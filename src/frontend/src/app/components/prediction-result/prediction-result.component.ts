import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PredictionResult } from '../../models/car';
import { AuthService } from '@auth0/auth0-angular';


@Component({
  selector: 'app-prediction-result',
  templateUrl: './prediction-result.component.html',
  styleUrls: ['./prediction-result.component.css']
})
export class PredictionResultComponent {
  @Input() loading = false;
  @Input() result: PredictionResult | null = null;
  @Input() isAuthenticated: boolean | null = null;

  @Output() save = new EventEmitter<void>();

  onSave() {
    this.save.emit();
  }

  badgeClass(label: PredictionResult['prediction'] | undefined) {
    switch (label) {
      case 'vgood': return 'alert-success';
      case 'good':  return 'alert-primary';
      case 'acc':   return 'alert-warning';
      default:      return 'alert-secondary';
    }
  }

}
