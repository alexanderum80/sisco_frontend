import { TestBed } from '@angular/core/testing';

import { TipoEntidadesService } from './tipo-entidades.service';

describe('TipoEntidadesService', () => {
  let service: TipoEntidadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoEntidadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
