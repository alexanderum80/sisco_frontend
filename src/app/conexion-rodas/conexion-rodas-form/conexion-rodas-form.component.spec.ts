import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConexionRodasFormComponent } from './conexion-rodas-form.component';

describe('ConexionRodasFormComponent', () => {
  let component: ConexionRodasFormComponent;
  let fixture: ComponentFixture<ConexionRodasFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConexionRodasFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConexionRodasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
