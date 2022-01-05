import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConexionRodasComponent } from './list-conexion-rodas.component';

describe('ListConexionRodasComponent', () => {
  let component: ListConexionRodasComponent;
  let fixture: ComponentFixture<ListConexionRodasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListConexionRodasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConexionRodasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
