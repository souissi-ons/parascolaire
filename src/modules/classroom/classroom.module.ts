import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from './entities/classroom.entity';

@Module({
  controllers: [ClassroomController],
  providers: [ClassroomService],
  imports: [TypeOrmModule.forFeature([Classroom])],
  exports: [ClassroomService],
})
export class ClassroomModule {}
