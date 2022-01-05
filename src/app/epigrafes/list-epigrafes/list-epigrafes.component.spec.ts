import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEpigrafesComponent } from './list-epigrafes.component';

describe('ListEpigrafesComponent', () => {
  let component: ListEpigrafesComponent;
  let fixture: ComponentFixture<ListEpigrafesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEpigrafesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEpigrafesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
