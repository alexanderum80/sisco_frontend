import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioInfoComponent } from './usuario-info.component';

describe('UsuarioInfoComponent', () => {
  let component: UsuarioInfoComponent;
  let fixture: ComponentFixture<UsuarioInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsuarioInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
