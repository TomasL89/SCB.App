import { TestBed } from '@angular/core/testing';

import { AzureStorage.ServiceService } from './azure-storage.service.service';

describe('AzureStorage.ServiceService', () => {
  let service: AzureStorage.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureStorage.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
