import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpresionesFormComponent } from './expresiones-form.component';

describe('ExpresionesFormComponent', () => {
  let component: ExpresionesFormComponent;
  let fixture: ComponentFixture<ExpresionesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpresionesFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpresionesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
