import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSupervisoresComponent } from './list-supervisores.component';

describe('ListSupervisoresComponent', () => {
  let component: ListSupervisoresComponent;
  let fixture: ComponentFixture<ListSupervisoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListSupervisoresComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSupervisoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
