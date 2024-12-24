import { forwardRef, Module } from '@nestjs/common';
import { RequestClassroomService } from './request-classroom.service';
import { RequestClassroomController } from './request-classroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestClassroom } from './entities/request-classroom.entity';
import { UserModule } from 'src/user/user.module';
import { ClassroomModule } from 'src/classroom/classroom.module';
import { EventModule } from 'src/event/event.module';

@Module({
  controllers: [RequestClassroomController],
  providers: [RequestClassroomService],
  imports: [
    TypeOrmModule.forFeature([RequestClassroom]),
    UserModule,
    ClassroomModule,
    forwardRef(() => EventModule),
  ],
  exports: [RequestClassroomService],
})
export class RequestClassroomModule {}
