import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPredictionsComponent } from './list-predictions.component';

describe('ListPredictionsComponent', () => {
  let component: ListPredictionsComponent;
  let fixture: ComponentFixture<ListPredictionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPredictionsComponent]
    });
    fixture = TestBed.createComponent(ListPredictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
