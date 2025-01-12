import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { In, Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { ClassroomService } from 'src/modules/classroom/classroom.service';
import { validateDates } from 'src/utils/validate-date.utils';
import { RequestClassroomService } from 'src/modules/request-classroom/request-classroom.service';
import { join } from 'path';
import * as fs from 'fs';
import { MembreService } from 'src/modules/membre/membre.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRep: Repository<Event>,
    private readonly userService: UserService,
    private readonly classService: ClassroomService,
    private readonly memberService: MembreService,
    @Inject(forwardRef(() => RequestClassroomService))
    private readonly requestClassroomService: RequestClassroomService,
  ) {}

  async create(createEventDto: CreateEventDto) {
    await this.classService.findOne(createEventDto.roomId);

    const user = await this.userService.findOne(createEventDto.organizerId);
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
    validateDates(createEventDto.startDateTime, createEventDto.endDateTime);

    // // Vérification des conflits avec des demandes acceptées
    await this.requestClassroomService.checkForConflicts(
      createEventDto.roomId,
      createEventDto.startDateTime,
      createEventDto.endDateTime,
    );

    // Vérification des conflits avec des événements acceptés
    await this.findConflictingEvent(
      createEventDto.roomId,
      createEventDto.startDateTime,
      createEventDto.endDateTime,
    );

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
      .where('event.roomId = :roomId AND event.id != :id', {
        roomId: updateEventDto.roomId,
        id: id,
      })
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
          message:
            'Un événement existe déjà dans cette salle pendant la plage horaire sélectionnée.',
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

  async findConflictingEvent(
    roomId: number,
    startDateTimeVar: Date,
    endDateTimeVar: Date,
  ): Promise<void> {
    const conflictingEvent = await this.eventRep
      .createQueryBuilder('event')
      .where('event.roomId = :roomId', { roomId: roomId })
      .andWhere('event.status = :status', { status: 'confirmed' })
      .andWhere(
        '(event.startDateTime < :endDate AND event.endDateTime > :startDate)',
        {
          startDate: startDateTimeVar,
          endDate: endDateTimeVar,
        },
      )
      .getOne();
    if (conflictingEvent) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message:
            'Un événement accepté existe déjà pour cette salle dans la plage horaire sélectionnée.',
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  async findEvents(userId: number) {
    // Récupérer l'utilisateur et ses informations de membre
    const user = await this.userService.findOne(userId);

    // Vérifier si l'utilisateur est un admin
    if (user.role === 'admin') {
      return this.eventRep.find(); // L'admin peut consulter tous les événements
    }

    // Clubs : Ils peuvent consulter les événements publics et ceux où ils sont organisateurs
    if (user.role === 'club') {
      return this.eventRep.find({
        where: [
          { private: false }, // Événements publics
          {
            organizerId: user.id, // Vérifier si le club est l'organisateur
          },
        ],
      });
    }

    // Étudiants : Ils peuvent consulter les événements publics et ceux où ils sont membres dans le club organisateur
    if (user.role === 'student') {
      // Étape 1: Récupérer les clubs de l'utilisateur
      const clubs = await this.memberService.getClubsByUserId(userId);
      const clubIds = clubs.map((member) => member.id);

      // Étape 2: Récupérer tous les événements privés liés à ces clubs
      const events = await this.eventRep.find({
        where: [
          { private: false }, // Événements publics
          {
            organizerId: In(clubIds), // Vérifier si le club est l'organisateur
          },
        ],
      });

      return events;
    }

    // Si le rôle ne correspond à aucun des cas ci-dessus, ne rien retourner
    return [];
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.eventRep.delete({ id });
  }

  async getImageByEventId(id: number): Promise<string> {
    // Rechercher l'événement par ID
    const event = await this.findOne(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Construire le chemin absolu vers l'image
    const imagePath = join(
      __dirname,
      '..',
      '..',
      event.imageUrl.replace('/', ''),
    );

    // Vérifier si l'image existe
    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException('Image not found');
    }

    // Retourner le chemin de l'image
    return imagePath;
  }
}
