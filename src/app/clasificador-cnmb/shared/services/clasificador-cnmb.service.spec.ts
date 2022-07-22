import { TestBed } from '@angular/core/testing';

import { ClasificadorCnmbService } from './clasificador-cnmb.service';

describe('ClasificadorCnmbService', () => {
  let service: ClasificadorCnmbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasificadorCnmbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
