import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificadorSubgruposFormComponent } from './clasificador-subgrupos-form.component';

describe('ClasificadorSubgruposFormComponent', () => {
  let component: ClasificadorSubgruposFormComponent;
  let fixture: ComponentFixture<ClasificadorSubgruposFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasificadorSubgruposFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasificadorSubgruposFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
