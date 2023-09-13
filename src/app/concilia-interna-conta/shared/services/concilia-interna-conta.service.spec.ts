import { TestBed } from '@angular/core/testing';

import { ConciliaInternaContaService } from './concilia-interna-conta.service';

describe('ConciliaInternaContaService', () => {
  let service: ConciliaInternaContaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConciliaInternaContaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
