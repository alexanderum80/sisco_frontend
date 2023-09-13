import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliaExternaDwhComponent } from './concilia-externa-dwh.component';

describe('ConciliaExternaDwhComponent', () => {
  let component: ConciliaExternaDwhComponent;
  let fixture: ComponentFixture<ConciliaExternaDwhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConciliaExternaDwhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConciliaExternaDwhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
