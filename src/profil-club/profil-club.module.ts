import { Module } from '@nestjs/common';
import { ProfilClubService } from './profil-club.service';
import { ProfilClubController } from './profil-club.controller';

@Module({
  controllers: [ProfilClubController],
  providers: [ProfilClubService],
})
export class ProfilClubModule {}
