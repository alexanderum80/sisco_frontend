import { TestBed } from '@angular/core/testing';

import { SupervisoresService } from './supervisores.service';

describe('SupervisoresService', () => {
  let service: SupervisoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupervisoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
