import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDatasetCardComponent } from './current-dataset-card.component';

describe('CurrentDatasetCardComponent', () => {
  let component: CurrentDatasetCardComponent;
  let fixture: ComponentFixture<CurrentDatasetCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentDatasetCardComponent]
    });
    fixture = TestBed.createComponent(CurrentDatasetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
