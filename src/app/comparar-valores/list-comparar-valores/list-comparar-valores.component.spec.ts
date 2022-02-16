import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompararValoresComponent } from './list-comparar-valores.component';

describe('ListCompararValoresComponent', () => {
  let component: ListCompararValoresComponent;
  let fixture: ComponentFixture<ListCompararValoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCompararValoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompararValoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
