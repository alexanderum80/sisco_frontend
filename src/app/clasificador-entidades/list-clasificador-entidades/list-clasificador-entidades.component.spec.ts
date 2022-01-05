import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClasificadorEntidadesComponent } from './list-clasificador-entidades.component';

describe('ListClasificadorEntidadesComponent', () => {
  let component: ListClasificadorEntidadesComponent;
  let fixture: ComponentFixture<ListClasificadorEntidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListClasificadorEntidadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClasificadorEntidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
