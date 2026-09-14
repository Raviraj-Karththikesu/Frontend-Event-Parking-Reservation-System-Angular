import { TestBed } from '@angular/core/testing';

import { BookingSelectionStateService } from './booking-selection-state.service';

describe('BookingSelectionStateService', () => {
  let service: BookingSelectionStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingSelectionStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
