import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipoEntidadesComponent } from './list-tipo-entidades.component';

describe('ListTipoEntidadesComponent', () => {
  let component: ListTipoEntidadesComponent;
  let fixture: ComponentFixture<ListTipoEntidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListTipoEntidadesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipoEntidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
