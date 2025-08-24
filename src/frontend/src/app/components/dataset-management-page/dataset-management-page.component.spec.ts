import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetManagementPageComponent } from './dataset-management-page.component';

describe('DatasetManagementPageComponent', () => {
  let component: DatasetManagementPageComponent;
  let fixture: ComponentFixture<DatasetManagementPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetManagementPageComponent]
    });
    fixture = TestBed.createComponent(DatasetManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
