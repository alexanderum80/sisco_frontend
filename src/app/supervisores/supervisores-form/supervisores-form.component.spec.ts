import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisoresFormComponent } from './supervisores-form.component';

describe('SupervisoresFormComponent', () => {
  let component: SupervisoresFormComponent;
  let fixture: ComponentFixture<SupervisoresFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisoresFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisoresFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
