import { TestBed } from '@angular/core/testing';

import { ClasificadorCuentaService } from './clasificador-cuenta.service';

describe('ClasificadorCuentaService', () => {
  let service: ClasificadorCuentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasificadorCuentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
