import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpigrafesFormComponent } from './epigrafes-form.component';

describe('EpigrafesFormComponent', () => {
  let component: EpigrafesFormComponent;
  let fixture: ComponentFixture<EpigrafesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EpigrafesFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EpigrafesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
