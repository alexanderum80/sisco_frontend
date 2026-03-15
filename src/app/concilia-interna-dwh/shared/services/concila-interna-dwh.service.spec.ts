import { TestBed } from '@angular/core/testing';

import { ConcilaInternaDwhService } from './concila-interna-dwh.service';

describe('ConcilaInternaDwhService', () => {
  let service: ConcilaInternaDwhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConcilaInternaDwhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
