import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClasificadorCnmbComponent } from './list-clasificador-cnmb.component';

describe('ListClasificadorCnmbComponent', () => {
  let component: ListClasificadorCnmbComponent;
  let fixture: ComponentFixture<ListClasificadorCnmbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListClasificadorCnmbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClasificadorCnmbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
