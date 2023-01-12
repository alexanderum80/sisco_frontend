import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliaOperacionesDwhComponent } from './concilia-operaciones-dwh.component';

describe('ConciliaOperacionesDwhComponent', () => {
  let component: ConciliaOperacionesDwhComponent;
  let fixture: ComponentFixture<ConciliaOperacionesDwhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConciliaOperacionesDwhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConciliaOperacionesDwhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
