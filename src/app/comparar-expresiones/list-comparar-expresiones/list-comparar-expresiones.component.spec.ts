import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompararExpresionesComponent } from './list-comparar-expresiones.component';

describe('ListCompararExpresionesComponent', () => {
  let component: ListCompararExpresionesComponent;
  let fixture: ComponentFixture<ListCompararExpresionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCompararExpresionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompararExpresionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
