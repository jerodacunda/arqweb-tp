import { TestBed } from '@angular/core/testing';

import { TableOrderService } from './table-order.service';

describe('TableOrderService', () => {
  let service: TableOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
