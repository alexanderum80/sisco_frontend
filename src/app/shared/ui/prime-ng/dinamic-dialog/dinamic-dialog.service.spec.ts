import { TestBed } from '@angular/core/testing';

import { DinamicDialogService } from './dinamic-dialog.service';

describe('DinamicDialogService', () => {
  let service: DinamicDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DinamicDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
