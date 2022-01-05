import { TestBed } from '@angular/core/testing';

import { EpigrafesService } from './epigrafes.service';

describe('EpigrafesService', () => {
  let service: EpigrafesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpigrafesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
