import { Test, TestingModule } from '@nestjs/testing';
import { MembreController } from './membre.controller';
import { MembreService } from './membre.service';

describe('MembreController', () => {
  let controller: MembreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembreController],
      providers: [MembreService],
    }).compile();

    controller = module.get<MembreController>(MembreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
