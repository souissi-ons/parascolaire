import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { UserModule } from 'src/user/user.module';
import { ClassroomModule } from 'src/classroom/classroom.module';
import { RequestClassroomModule } from 'src/request-classroom/request-classroom.module';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [
    TypeOrmModule.forFeature([Event]),
    UserModule,
    ClassroomModule,
    forwardRef(() => RequestClassroomModule),
  ],
  exports: [EventService],
})
export class EventModule {}
