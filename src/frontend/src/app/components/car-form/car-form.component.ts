import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css']
})


export class CarFormComponent {
  @Output() evaluate = new EventEmitter<any>();

  options = [
    { label: 'Molto alto', value: 'vhigh' },
    { label: 'Alto',      value: 'high'  },
    { label: 'Medio',    value: 'med'   },
    { label: 'Basso',       value: 'low'   },
  ];

  constructor(private fb: FormBuilder) {}

  form = this.fb.nonNullable.group({
    buying: ['', Validators.required],
    maint: ['', Validators.required],
    doors:       ['', Validators.required],
    persons:     ['', Validators.required],
    lug_boot:     ['', Validators.required],
    safety:      ['', Validators.required],
  });

  submit() {
    if (this.form.valid) this.evaluate.emit(this.form.getRawValue());
  }
}
