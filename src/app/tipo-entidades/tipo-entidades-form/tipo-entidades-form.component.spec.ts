import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoEntidadesFormComponent } from './tipo-entidades-form.component';

describe('TipoEntidadesFormComponent', () => {
  let component: TipoEntidadesFormComponent;
  let fixture: ComponentFixture<TipoEntidadesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoEntidadesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoEntidadesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
