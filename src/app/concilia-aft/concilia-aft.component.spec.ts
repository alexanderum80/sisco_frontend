import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliaAftComponent } from './concilia-aft.component';

describe('ConciliaAftComponent', () => {
  let component: ConciliaAftComponent;
  let fixture: ComponentFixture<ConciliaAftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConciliaAftComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConciliaAftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
