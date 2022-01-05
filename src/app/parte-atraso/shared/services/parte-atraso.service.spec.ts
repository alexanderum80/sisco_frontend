import { TestBed } from '@angular/core/testing';

import { ParteAtrasoService } from './parte-atraso.service';

describe('ParteAtrasoService', () => {
  let service: ParteAtrasoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParteAtrasoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
