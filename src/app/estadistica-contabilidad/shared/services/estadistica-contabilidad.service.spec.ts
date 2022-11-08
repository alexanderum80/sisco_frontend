import { TestBed } from '@angular/core/testing';

import { EstadisticaContabilidadService } from './estadistica-contabilidad.service';

describe('EstadisticaContabilidadService', () => {
  let service: EstadisticaContabilidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadisticaContabilidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
