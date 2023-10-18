import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiService],
    }).compile();

    service = module.get<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateRequestId', () => {
    let prefix = '';
    beforeAll(() => {
      prefix = (Math.random() + 1).toString(36).substring(7);
    });
    it('should generate a request ID with the given prefix', async () => {
      const requestId = await service.generateRequestId(prefix);
      expect(requestId.startsWith(prefix)).toBe(true);
    });
    it('should generate a request ID with the fixed uuid length', async () => {
      const uuidLength = 36;
      const requestId = await service.generateRequestId(prefix);
      expect(requestId.length).toBe(prefix.length + uuidLength + 1); // 1 for dash symbol
    });
  });
});
