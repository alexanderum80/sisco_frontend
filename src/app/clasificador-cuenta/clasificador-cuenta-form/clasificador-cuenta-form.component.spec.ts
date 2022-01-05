import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificadorCuentaFormComponent } from './clasificador-cuenta-form.component';

describe('ClasificadorCuentaFormComponent', () => {
  let component: ClasificadorCuentaFormComponent;
  let fixture: ComponentFixture<ClasificadorCuentaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasificadorCuentaFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasificadorCuentaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
