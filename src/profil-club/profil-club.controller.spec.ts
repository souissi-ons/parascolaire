import { Test, TestingModule } from '@nestjs/testing';
import { ProfilClubController } from './profil-club.controller';
import { ProfilClubService } from './profil-club.service';

describe('ProfilClubController', () => {
  let controller: ProfilClubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilClubController],
      providers: [ProfilClubService],
    }).compile();

    controller = module.get<ProfilClubController>(ProfilClubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
