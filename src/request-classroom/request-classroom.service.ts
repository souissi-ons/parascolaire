import { Injectable } from '@nestjs/common';
import { CreateRequestClassroomDto } from './dto/create-request-classroom.dto';
import { UpdateRequestClassroomDto } from './dto/update-request-classroom.dto';

@Injectable()
export class RequestClassroomService {
  create(createRequestClassroomDto: CreateRequestClassroomDto) {
    return 'This action adds a new requestClassroom';
  }

  findAll() {
    return `This action returns all requestClassroom`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requestClassroom`;
  }

  update(id: number, updateRequestClassroomDto: UpdateRequestClassroomDto) {
    return `This action updates a #${id} requestClassroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestClassroom`;
  }
}
