import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClasificadorSubgruposComponent } from './list-clasificador-subgrupos.component';

describe('ListClasificadorSubgruposComponent', () => {
  let component: ListClasificadorSubgruposComponent;
  let fixture: ComponentFixture<ListClasificadorSubgruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListClasificadorSubgruposComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClasificadorSubgruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
