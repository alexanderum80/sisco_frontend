import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeCuentasCobrarPagarFormComponent } from './informe-cuentas-cobrar-pagar-form.component';

describe('InformeCuentasCobrarPagarFormComponent', () => {
  let component: InformeCuentasCobrarPagarFormComponent;
  let fixture: ComponentFixture<InformeCuentasCobrarPagarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeCuentasCobrarPagarFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeCuentasCobrarPagarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
