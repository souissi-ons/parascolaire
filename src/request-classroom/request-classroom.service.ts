import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestClassroomDto } from './dto/create-request-classroom.dto';
import { UpdateRequestClassroomDto } from './dto/update-request-classroom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestClassroom } from './entities/request-classroom.entity';
import { Repository } from 'typeorm';
import { ClassroomService } from 'src/classroom/classroom.service';
import { UserService } from 'src/user/user.service';
import { EventService } from 'src/event/event.service';
import { validateDates } from 'src/utils/validate-date.utils';

@Injectable()
export class RequestClassroomService {
  constructor(
    @InjectRepository(RequestClassroom)
    private reqClassRep: Repository<RequestClassroom>,
    private readonly classService: ClassroomService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService,
  ) {}

  async create(createRequestClassroomDto: CreateRequestClassroomDto) {
    // Vérification de l'existence de la salle
    await this.classService.findOne(createRequestClassroomDto.roomId);

    // Vérification de l'existence de l'utilisateur
    const user = await this.userService.findOne(
      createRequestClassroomDto.requestedBy,
    );
    if (user.role !== 'club') {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: "L'organisateur doit être un club. ",
        },
        HttpStatus.CONFLICT,
      );
    }

    // Vérification de la validité de la date
    validateDates(
      createRequestClassroomDto.startDateTime,
      createRequestClassroomDto.endDateTime,
    );

    // Vérification des conflits avec des demandes acceptées
    await this.checkForConflicts(
      createRequestClassroomDto.roomId,
      createRequestClassroomDto.startDateTime,
      createRequestClassroomDto.endDateTime,
    );

    // Vérification des conflits avec des événements acceptés
    await this.eventService.findConflictingEvent(
      createRequestClassroomDto.roomId,
      createRequestClassroomDto.startDateTime,
      createRequestClassroomDto.endDateTime,
    );

    // Création et enregistrement de la nouvelle demande
    const newRequest = this.reqClassRep.create(createRequestClassroomDto);
    return this.reqClassRep.save(newRequest);
  }

  findAll() {
    return this.reqClassRep.find();
  }

  async findOne(id: number) {
    const request = await this.reqClassRep.findOneBy({ id });
    if (!request) {
      throw new NotFoundException(`Request classroom with id ${id} not found`);
    }
    return request;
  }

  async update(
    id: number,
    updateRequestClassroomDto: UpdateRequestClassroomDto,
  ) {
    const existingRequest = await this.findOne(id);

    const conflictingRequest = await this.reqClassRep
      .createQueryBuilder('request')
      .where('request.roomId = :roomId AND request.id != :id', {
        roomId: updateRequestClassroomDto.roomId,
        id: id,
      })
      .andWhere(
        '(request.startDateTime < :endDateTime AND request.endDateTime > :startDateTime)',
        {
          startDateTime: updateRequestClassroomDto.startDateTime,
          endDateTime: updateRequestClassroomDto.endDateTime,
        },
      )
      .getOne();

    if (conflictingRequest) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message:
            'Un événement existe déjà dans cette salle pendant la plage horaire sélectionnée.',
        },
        HttpStatus.CONFLICT,
      );
    }
    if (
      updateRequestClassroomDto.startDateTime >=
      updateRequestClassroomDto.endDateTime
    ) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: 'La date de début doit être antérieure à la date de fin.',
        },
        HttpStatus.CONFLICT,
      );
    }
    await this.classService.findOne(updateRequestClassroomDto.roomId);
    await this.userService.findOne(updateRequestClassroomDto.requestedBy);
    const updatedRequest = { ...existingRequest, ...updateRequestClassroomDto };
    return this.reqClassRep.save(updatedRequest);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.reqClassRep.delete({ id });
  }

  async checkForConflicts(
    roomId: number,
    startDateTime: Date,
    endDateTime: Date,
  ): Promise<void> {
    const conflictingRequest = await this.reqClassRep
      .createQueryBuilder('request')
      .where('request.roomId = :roomId', { roomId })
      .andWhere('request.status = :status', { status: 'confirmed' })
      .andWhere(
        ':startDateTime < request.endDateTime AND :endDateTime > request.startDateTime',
        { startDateTime, endDateTime },
      )
      .getOne();

    if (conflictingRequest) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message:
            'Une demande acceptée existe déjà pour cette salle dans la plage horaire sélectionnée.',
        },
        HttpStatus.CONFLICT,
      );
    }
  }
}
