import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificadorCnmbFormComponent } from './clasificador-cnmb-form.component';

describe('ClasificadorCnmbFormComponent', () => {
  let component: ClasificadorCnmbFormComponent;
  let fixture: ComponentFixture<ClasificadorCnmbFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasificadorCnmbFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasificadorCnmbFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
