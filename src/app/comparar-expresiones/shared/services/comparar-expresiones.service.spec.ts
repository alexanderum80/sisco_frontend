import { TestBed } from '@angular/core/testing';

import { CompararExpresionesService } from './comparar-expresiones.service';

describe('CompararExpresionesService', () => {
  let service: CompararExpresionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompararExpresionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
