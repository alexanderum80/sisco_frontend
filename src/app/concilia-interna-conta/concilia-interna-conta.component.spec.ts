import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliaInternaContaComponent } from './concilia-interna-conta.component';

describe('ConciliaInternaContaComponent', () => {
  let component: ConciliaInternaContaComponent;
  let fixture: ComponentFixture<ConciliaInternaContaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConciliaInternaContaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConciliaInternaContaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
