import { TestBed } from '@angular/core/testing';

import { ExpresionesService } from './expresiones.service';

describe('ExpresionesService', () => {
  let service: ExpresionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpresionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
