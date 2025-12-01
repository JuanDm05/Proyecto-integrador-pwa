import { TestBed } from '@angular/core/testing';

import { ChatAi } from './chat-ai';

describe('ChatAi', () => {
  let service: ChatAi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatAi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
