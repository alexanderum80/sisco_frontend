import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliaExternaContaComponent } from './concilia-externa-conta.component';

describe('ConciliaExternaContaComponent', () => {
  let component: ConciliaExternaContaComponent;
  let fixture: ComponentFixture<ConciliaExternaContaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConciliaExternaContaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConciliaExternaContaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
