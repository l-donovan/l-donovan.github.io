import { TestBed } from '@angular/core/testing';

import { WindowContentService } from './window-content.service';

describe('WindowContentService', () => {
  let service: WindowContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
