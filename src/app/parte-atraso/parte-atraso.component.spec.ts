import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParteAtrasoComponent } from './parte-atraso.component';

describe('ParteAtrasoComponent', () => {
  let component: ParteAtrasoComponent;
  let fixture: ComponentFixture<ParteAtrasoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParteAtrasoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParteAtrasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
