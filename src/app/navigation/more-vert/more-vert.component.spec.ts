import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreVertComponent } from './more-vert.component';

describe('MoreVertComponent', () => {
  let component: MoreVertComponent;
  let fixture: ComponentFixture<MoreVertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MoreVertComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreVertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
