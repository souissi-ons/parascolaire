import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { UserModule } from 'src/modules/user/user.module';
import { ClassroomModule } from 'src/modules/classroom/classroom.module';
import { RequestClassroomModule } from 'src/modules/request-classroom/request-classroom.module';
import { MembreModule } from 'src/modules/membre/membre.module';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [
    TypeOrmModule.forFeature([Event]),
    UserModule,
    ClassroomModule,
    MembreModule,
    forwardRef(() => RequestClassroomModule),
  ],
  exports: [EventService],
})
export class EventModule {}
