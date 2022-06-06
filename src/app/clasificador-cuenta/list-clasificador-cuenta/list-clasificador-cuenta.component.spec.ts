import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClasificadorCuentaComponent } from './list-clasificador-cuenta.component';

describe('ListClasificadorCuentaComponent', () => {
  let component: ListClasificadorCuentaComponent;
  let fixture: ComponentFixture<ListClasificadorCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListClasificadorCuentaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClasificadorCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
