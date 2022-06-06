import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCuentasNoPermitidasComponent } from './list-cuentas-no-permitidas.component';

describe('ListCuentasNoPermitidasComponent', () => {
  let component: ListCuentasNoPermitidasComponent;
  let fixture: ComponentFixture<ListCuentasNoPermitidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListCuentasNoPermitidasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCuentasNoPermitidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
