import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliaInternaDwhComponent } from './concilia-interna-dwh.component';

describe('ConciliaInternaDwhComponent', () => {
  let component: ConciliaInternaDwhComponent;
  let fixture: ComponentFixture<ConciliaInternaDwhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConciliaInternaDwhComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConciliaInternaDwhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
