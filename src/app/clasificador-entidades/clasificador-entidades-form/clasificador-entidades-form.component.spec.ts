import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificadorEntidadesFormComponent } from './clasificador-entidades-form.component';

describe('ClasificadorEntidadesFormComponent', () => {
  let component: ClasificadorEntidadesFormComponent;
  let fixture: ComponentFixture<ClasificadorEntidadesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasificadorEntidadesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasificadorEntidadesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
