import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompararExpresionesFormComponent } from './comparar-expresiones-form.component';

describe('CompararExpresionesFormComponent', () => {
  let component: CompararExpresionesFormComponent;
  let fixture: ComponentFixture<CompararExpresionesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompararExpresionesFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompararExpresionesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
