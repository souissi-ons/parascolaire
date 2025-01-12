import { Module } from '@nestjs/common';
import { ProfilClubService } from './profil-club.service';
import { ProfilClubController } from './profil-club.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilClub } from './entities/profil-club.entity';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [ProfilClubController],
  providers: [ProfilClubService],
  imports: [TypeOrmModule.forFeature([ProfilClub]), UserModule],
})
export class ProfilClubModule {}
