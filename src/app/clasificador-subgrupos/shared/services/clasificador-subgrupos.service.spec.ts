import { TestBed } from '@angular/core/testing';

import { ClasificadorSubgruposService } from './clasificador-subgrupos.service';

describe('ClasificadorSubgruposService', () => {
  let service: ClasificadorSubgruposService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasificadorSubgruposService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
