import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompararValoresFormComponent } from './comparar-valores-form.component';

describe('CompararValoresFormComponent', () => {
  let component: CompararValoresFormComponent;
  let fixture: ComponentFixture<CompararValoresFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompararValoresFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompararValoresFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
