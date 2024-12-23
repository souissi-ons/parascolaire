import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequestClassroomService } from './request-classroom.service';
import { CreateRequestClassroomDto } from './dto/create-request-classroom.dto';
import { UpdateRequestClassroomDto } from './dto/update-request-classroom.dto';

@Controller('request-classroom')
export class RequestClassroomController {
  constructor(private readonly requestClassroomService: RequestClassroomService) {}

  @Post()
  create(@Body() createRequestClassroomDto: CreateRequestClassroomDto) {
    return this.requestClassroomService.create(createRequestClassroomDto);
  }

  @Get()
  findAll() {
    return this.requestClassroomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestClassroomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestClassroomDto: UpdateRequestClassroomDto) {
    return this.requestClassroomService.update(+id, updateRequestClassroomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestClassroomService.remove(+id);
  }
}
