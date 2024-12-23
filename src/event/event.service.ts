import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ClassroomService } from 'src/classroom/classroom.service';

@Injectable()
export class EventService {
  constructor(@InjectRepository(Event) private eventRep: Repository<Event>,
    private readonly userService: UserService,
    private readonly classService: ClassroomService,
  ) { }

  async create(createEventDto: CreateEventDto) {
    const conflictingEvent = await this.eventRep
      .createQueryBuilder('event')
      .where('event.roomId = :roomId', { roomId: createEventDto.roomId })
      .andWhere(
        '(event.startDateTime < :endDateTime AND event.endDateTime > :startDateTime)',
        {
          startDateTime: createEventDto.startDateTime,
          endDateTime: createEventDto.endDateTime,
        },
      )
      .getOne();

    if (conflictingEvent) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: 'Un événement existe déjà dans cette salle pendant la plage horaire sélectionnée.',
        },
        HttpStatus.CONFLICT,
      );
    }
    if (createEventDto.startDateTime >= createEventDto.endDateTime) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: 'La date de début doit être antérieure à la date de fin.',
        },
        HttpStatus.CONFLICT,
      );
    }
    await this.classService.findOne(createEventDto.roomId);
    await this.userService.findOne(createEventDto.organizerId);
    // Create and save the new event if no conflict is found
    const newEvent = this.eventRep.create(createEventDto);
    return this.eventRep.save(newEvent);
  }

  async findAll() {
    return this.eventRep.find();
  }

  async findOne(id: number) {
    const event = await this.eventRep.findOneBy({ id });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const existingEvent = await this.findOne(id);
    const conflictingEvent = await this.eventRep
      .createQueryBuilder('event')
      .where('event.roomId = :roomId AND event.id != :id', { roomId: updateEventDto.roomId, id:id })
      .andWhere(
        '(event.startDateTime < :endDateTime AND event.endDateTime > :startDateTime)',
        {
          startDateTime: updateEventDto.startDateTime,
          endDateTime: updateEventDto.endDateTime,
        },
      )
      .getOne();

    if (conflictingEvent) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: 'Un événement existe déjà dans cette salle pendant la plage horaire sélectionnée.',
        },
        HttpStatus.CONFLICT,
      );
    }
    if (updateEventDto.startDateTime >= updateEventDto.endDateTime) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: 'La date de début doit être antérieure à la date de fin.',
        },
        HttpStatus.CONFLICT,
      );
    }
    await this.classService.findOne(updateEventDto.roomId);
    await this.userService.findOne(updateEventDto.organizerId);
    const updatedEvent = { ...existingEvent, ...updateEventDto };
    return this.eventRep.save(updatedEvent);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.eventRep.delete({ id });
  }
}
