import { Test, TestingModule } from '@nestjs/testing';
import { MembreService } from './membre.service';

describe('MembreService', () => {
  let service: MembreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembreService],
    }).compile();

    service = module.get<MembreService>(MembreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
