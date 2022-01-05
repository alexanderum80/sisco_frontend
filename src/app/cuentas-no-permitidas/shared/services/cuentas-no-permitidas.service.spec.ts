import { TestBed } from '@angular/core/testing';

import { CuentasNoPermitidasService } from './cuentas-no-permitidas.service';

describe('CuentasNoPermitidasService', () => {
  let service: CuentasNoPermitidasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentasNoPermitidasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
