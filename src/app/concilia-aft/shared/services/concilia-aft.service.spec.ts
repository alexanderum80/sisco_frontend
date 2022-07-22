import { TestBed } from '@angular/core/testing';

import { ConciliaAftService } from './concilia-aft.service';

describe('ConciliaAftService', () => {
  let service: ConciliaAftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConciliaAftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
