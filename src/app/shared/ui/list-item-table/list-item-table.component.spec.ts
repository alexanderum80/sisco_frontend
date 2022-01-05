import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemTableComponent } from './list-item-table.component';

describe('ListItemTableComponent', () => {
  let component: ListItemTableComponent;
  let fixture: ComponentFixture<ListItemTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListItemTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
