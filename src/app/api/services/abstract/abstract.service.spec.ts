/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AbstractService } from './abstract.service';

describe('Service: Abstract', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AbstractService],
    });
  });

  it('should ...', inject([AbstractService], (service: AbstractService) => {
    expect(service).toBeTruthy();
  }));
});
