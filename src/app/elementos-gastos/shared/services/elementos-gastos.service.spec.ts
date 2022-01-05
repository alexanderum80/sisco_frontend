import { TestBed } from '@angular/core/testing';

import { ElementosGastosService } from './elementos-gastos.service';

describe('ElementosGastosService', () => {
  let service: ElementosGastosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementosGastosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
