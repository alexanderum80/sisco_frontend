import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasNoPermitidasFormComponent } from './cuentas-no-permitidas-form.component';

describe('CuentasNoPermitidasFormComponent', () => {
  let component: CuentasNoPermitidasFormComponent;
  let fixture: ComponentFixture<CuentasNoPermitidasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuentasNoPermitidasFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasNoPermitidasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
