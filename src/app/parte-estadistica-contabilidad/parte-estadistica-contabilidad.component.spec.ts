import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParteEstadisticaContabilidadComponent } from './parte-estadistica-contabilidad.component';

describe('EstadisticaContabilidadComponent', () => {
  let component: ParteEstadisticaContabilidadComponent;
  let fixture: ComponentFixture<ParteEstadisticaContabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParteEstadisticaContabilidadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParteEstadisticaContabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
