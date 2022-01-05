import { TestBed } from '@angular/core/testing';

import { ConciliaGoldenDwhService } from './concilia-golden-dwh.service';

describe('ConciliaGoldenDwhService', () => {
  let service: ConciliaGoldenDwhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConciliaGoldenDwhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
