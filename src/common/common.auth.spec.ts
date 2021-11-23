import { Test, TestingModule } from '@nestjs/testing';
import { CommonAuth } from './common.auth';

describe('Auth', () => {
  let provider: CommonAuth;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonAuth],
    }).compile();

    provider = module.get<CommonAuth>(CommonAuth);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
