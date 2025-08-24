import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAreaComponent } from './upload-area.component';

describe('UploadAreaComponent', () => {
  let component: UploadAreaComponent;
  let fixture: ComponentFixture<UploadAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadAreaComponent]
    });
    fixture = TestBed.createComponent(UploadAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
