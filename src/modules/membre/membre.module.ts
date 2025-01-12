import { Module } from '@nestjs/common';
import { MembreService } from './membre.service';
import { MembreController } from './membre.controller';
import { UserModule } from 'src/modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membre } from './entities/membre.entity';

@Module({
  controllers: [MembreController],
  providers: [MembreService],
  imports: [TypeOrmModule.forFeature([Membre]), UserModule],
  exports: [MembreService],
})
export class MembreModule {}
