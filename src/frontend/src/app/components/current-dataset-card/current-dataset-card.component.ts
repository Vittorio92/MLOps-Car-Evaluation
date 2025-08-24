import { Component, Input } from '@angular/core';
import { Dataset } from '../../models/dataset';

@Component({
  selector: 'app-current-dataset-card',
  templateUrl: './current-dataset-card.component.html',
  styleUrls: ['./current-dataset-card.component.css']
})
export class CurrentDatasetCardComponent {

  @Input() dataset: Dataset | null = null;

}
