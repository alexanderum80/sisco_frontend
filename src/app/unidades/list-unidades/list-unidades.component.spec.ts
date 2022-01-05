import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUnidadesComponent } from './list-unidades.component';

describe('ListUnidadesComponent', () => {
  let component: ListUnidadesComponent;
  let fixture: ComponentFixture<ListUnidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUnidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUnidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
