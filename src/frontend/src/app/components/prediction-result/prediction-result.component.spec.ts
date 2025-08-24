import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionResultComponent } from './prediction-result.component';

describe('PredictionResultComponent', () => {
  let component: PredictionResultComponent;
  let fixture: ComponentFixture<PredictionResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PredictionResultComponent]
    });
    fixture = TestBed.createComponent(PredictionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
