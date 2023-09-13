import { TestBed } from '@angular/core/testing';

import { ParteEstadisticaContabilidadService } from './parte-estadistica-contabilidad.service';

describe('ParteEstadisticaContabilidadService', () => {
  let service: ParteEstadisticaContabilidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParteEstadisticaContabilidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
