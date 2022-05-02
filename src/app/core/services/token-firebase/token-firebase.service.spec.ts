import { TestBed } from '@angular/core/testing';

import { TokenFirebaseService } from './token-firebase.service';

describe('TokenFirebaseService', () => {
  let service: TokenFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
