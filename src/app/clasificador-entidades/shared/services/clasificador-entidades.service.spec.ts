import { TestBed } from '@angular/core/testing';

import { ClasificadorEntidadesService } from './clasificador-entidades.service';

describe('ClasificadorEntidadesService', () => {
  let service: ClasificadorEntidadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasificadorEntidadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
