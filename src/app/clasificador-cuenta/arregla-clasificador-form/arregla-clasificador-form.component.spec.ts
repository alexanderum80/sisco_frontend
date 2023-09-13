import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArreglaClasificadorFormComponent } from './arregla-clasificador-form.component';

describe('ArreglaClasificadorFormComponent', () => {
  let component: ArreglaClasificadorFormComponent;
  let fixture: ComponentFixture<ArreglaClasificadorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArreglaClasificadorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArreglaClasificadorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
