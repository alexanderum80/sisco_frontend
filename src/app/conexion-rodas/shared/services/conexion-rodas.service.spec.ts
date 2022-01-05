import { TestBed } from '@angular/core/testing';

import { ConexionRodasService } from './conexion-rodas.service';

describe('ConexionRodasService', () => {
  let service: ConexionRodasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConexionRodasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
