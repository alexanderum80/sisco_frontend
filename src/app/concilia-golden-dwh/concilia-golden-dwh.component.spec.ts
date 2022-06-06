import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliaGoldenDwhComponent } from './concilia-golden-dwh.component';

describe('ConciliaGoldenDwhComponent', () => {
  let component: ConciliaGoldenDwhComponent;
  let fixture: ComponentFixture<ConciliaGoldenDwhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConciliaGoldenDwhComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConciliaGoldenDwhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
