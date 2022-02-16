import { TestBed } from '@angular/core/testing';

import { CompararValoresService } from './comparar-valores.service';

describe('CompararValoresService', () => {
  let service: CompararValoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompararValoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
