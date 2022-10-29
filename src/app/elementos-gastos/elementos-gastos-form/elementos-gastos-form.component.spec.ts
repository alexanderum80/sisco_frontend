import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementosGastosFormComponent } from './elementos-gastos-form.component';

describe('ElementosGastosFormComponent', () => {
  let component: ElementosGastosFormComponent;
  let fixture: ComponentFixture<ElementosGastosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElementosGastosFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementosGastosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
