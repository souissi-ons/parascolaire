import { Test, TestingModule } from '@nestjs/testing';
import { ProfilClubService } from './profil-club.service';

describe('ProfilClubService', () => {
  let service: ProfilClubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfilClubService],
    }).compile();

    service = module.get<ProfilClubService>(ProfilClubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
