import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Classroom } from './entities/classroom.entity';

@Injectable()
export class ClassroomService {
  constructor(@InjectRepository(Classroom) private classroomRep : Repository<Classroom>){}

  async create(createClassroomDto: CreateClassroomDto) {
    const newClass = this.classroomRep.create(createClassroomDto);

    const existingClass = await this.classroomRep.findOneBy({ num: newClass.num  });
    if (existingClass) {
        throw new HttpException(
            {
                status: HttpStatus.CONFLICT,
                message: 'Une salle avec ce numéro existe déjà.',
            },
            HttpStatus.CONFLICT,
        );
    }
    return this.classroomRep.save(newClass);
}

  async findAll() {
    return  this.classroomRep.find();;
  }

  async findOne(id: number) {
    const classroom= await this.classroomRep.findOneBy({id});
    if (!classroom) {
      throw new NotFoundException(`Classroom with id ${id} not found`);
    }
    return classroom ;
  }

  async update(id: number, updateClassroomDto: UpdateClassroomDto) {
    const existingClassroom = await this.findOne(id);

    const OtherClass = await this.classroomRep.findOne({
      where: { num: updateClassroomDto.num, id: Not(id) },
    });    
    if (OtherClass) {
        throw new HttpException(
            {
                status: HttpStatus.CONFLICT,
                message: 'Une salle avec ce numéro existe déjà.',
            },
            HttpStatus.CONFLICT,
        );
    }
    const updatedClassroom = { ...existingClassroom, ...updateClassroomDto };
    return this.classroomRep.save(updatedClassroom);
  }

  async remove(id: number) {
    const classroom = await this.findOne(id);
    
    return this.classroomRep.delete({id});;
  }
}
