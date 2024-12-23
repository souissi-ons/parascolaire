import { Module } from '@nestjs/common';
import { RequestClassroomService } from './request-classroom.service';
import { RequestClassroomController } from './request-classroom.controller';

@Module({
  controllers: [RequestClassroomController],
  providers: [RequestClassroomService],
})
export class RequestClassroomModule {}
