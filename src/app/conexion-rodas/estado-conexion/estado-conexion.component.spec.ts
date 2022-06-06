import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoConexionRodasComponent } from './estado-conexion.component';

describe('ChequeaConexionComponent', () => {
  let component: EstadoConexionRodasComponent;
  let fixture: ComponentFixture<EstadoConexionRodasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EstadoConexionRodasComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoConexionRodasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
