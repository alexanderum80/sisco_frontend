import { TestBed } from '@angular/core/testing';

import { InformeCuentasCobrarPagarService } from './informe-cuentas-cobrar-pagar.service';

describe('InformeCuentasCobrarPagarService', () => {
  let service: InformeCuentasCobrarPagarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformeCuentasCobrarPagarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
