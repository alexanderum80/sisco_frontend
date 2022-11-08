import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaContabilidadComponent } from './estadistica-contabilidad.component';

describe('EstadisticaContabilidadComponent', () => {
  let component: EstadisticaContabilidadComponent;
  let fixture: ComponentFixture<EstadisticaContabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticaContabilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticaContabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
