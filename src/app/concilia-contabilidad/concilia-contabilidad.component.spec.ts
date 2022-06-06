import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliaContabilidadComponent } from './concilia-contabilidad.component';

describe('ConciliaContabilidadComponent', () => {
  let component: ConciliaContabilidadComponent;
  let fixture: ComponentFixture<ConciliaContabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConciliaContabilidadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConciliaContabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
