import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarEvaluationPageComponent } from './car-evaluation-page.component';

describe('CarEvaluationPageComponent', () => {
  let component: CarEvaluationPageComponent;
  let fixture: ComponentFixture<CarEvaluationPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarEvaluationPageComponent]
    });
    fixture = TestBed.createComponent(CarEvaluationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
