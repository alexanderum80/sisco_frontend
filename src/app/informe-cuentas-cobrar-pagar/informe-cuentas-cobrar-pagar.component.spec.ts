import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeCuentasCobrarPagarComponent } from './informe-cuentas-cobrar-pagar.component';

describe('InformeCuentasCobrarPagarComponent', () => {
  let component: InformeCuentasCobrarPagarComponent;
  let fixture: ComponentFixture<InformeCuentasCobrarPagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeCuentasCobrarPagarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeCuentasCobrarPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
