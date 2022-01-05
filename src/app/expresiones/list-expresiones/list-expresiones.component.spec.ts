import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExpresionesComponent } from './list-expresiones.component';

describe('ListExpresionesComponent', () => {
  let component: ListExpresionesComponent;
  let fixture: ComponentFixture<ListExpresionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListExpresionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExpresionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
