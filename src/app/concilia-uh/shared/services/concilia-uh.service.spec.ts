import { TestBed } from '@angular/core/testing';

import { ConciliaUhService } from './concilia-uh.service';

describe('ConciliaUhService', () => {
  let service: ConciliaUhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConciliaUhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
