import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliaUhComponent } from './concilia-uh.component';

describe('ConciliaUhComponent', () => {
  let component: ConciliaUhComponent;
  let fixture: ComponentFixture<ConciliaUhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConciliaUhComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConciliaUhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
