import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListElementosGastosComponent } from './list-elementos-gastos.component';

describe('ListElementosGastosComponent', () => {
  let component: ListElementosGastosComponent;
  let fixture: ComponentFixture<ListElementosGastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListElementosGastosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListElementosGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
