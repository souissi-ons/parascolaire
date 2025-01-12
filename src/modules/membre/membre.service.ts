import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMembreDto } from './dto/create-membre.dto';
import { UpdateMembreDto } from './dto/update-membre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Membre } from './entities/membre.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class MembreService {
  constructor(
    @InjectRepository(Membre) private membreResp: Repository<Membre>,
    private readonly userService: UserService,
  ) {}

  async createMultiple(createMembresDto: CreateMembreDto[]) {
    const newMembers = [];

    for (const createMembreDto of createMembresDto) {
      const student = await this.userService.findOne(createMembreDto.studentId);
      if (student.role !== 'student') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            message: `L'utilisateur avec l'ID ${createMembreDto.studentId} doit être un étudiant.`,
          },
          HttpStatus.CONFLICT,
        );
      }

      const club = await this.userService.findOne(createMembreDto.clubId);
      if (club.role !== 'club') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            message: `L'utilisateur avec l'ID ${createMembreDto.clubId} doit être un club.`,
          },
          HttpStatus.CONFLICT,
        );
      }

      const existingMember = await this.membreResp.findOne({
        where: {
          studentId: { id: createMembreDto.studentId },
          clubId: { id: createMembreDto.clubId },
        },
      });

      if (existingMember) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            message: `L'étudiant avec l'ID ${createMembreDto.studentId} existe déjà dans ce club.`,
          },
          HttpStatus.CONFLICT,
        );
      }

      const newMember = this.membreResp.create({
        studentId: student,
        clubId: club,
      });

      newMembers.push(newMember);
    }

    // Sauvegarde en une seule transaction
    return this.membreResp.save(newMembers);
  }

  findAll() {
    return this.membreResp.find();
  }

  async getMembers(clubId: number) {
    // Récupérez tous les membres du club donné
    const clubMembers = await this.membreResp.find({
      where: { clubId: { id: clubId } },
      select: ['studentId'],
    });
    return clubMembers.map((member) => member.studentId);
  }

  async getNonMembers(clubId: number) {
    // Récupérez tous les utilisateurs ayant le rôle "student"
    const students = await this.userService.findStudents();

    // Récupérez les membres du club
    const clubMembers = await this.getMembers(clubId);

    // // Obtenez une liste des IDs des étudiants déjà membres du club
    const memberIds = clubMembers.map((member) => member.id); // Accédez à 'student.id'

    // console.log('memberIds', memberIds);

    // Filtrez les étudiants qui ne sont pas dans la liste des membres
    const nonMembers = students.filter(
      (student) => !memberIds.includes(student.id),
    );

    return nonMembers;
  }

  async getClubsByUserId(userId: number) {
    // Récupérez tous les clubs du étudiant donné
    const clubMembers = await this.membreResp.find({
      where: { studentId: { id: userId } },
      select: ['clubId'],
    });
    return clubMembers.map((member) => member.clubId);
  }

  async findOne(id: number) {
    const member = await this.membreResp.findOneBy({ id });
    if (!member) {
      throw new NotFoundException(`Member with id ${id} not found`);
    }
    return member;
  }

  update(id: number, updateMembreDto: UpdateMembreDto) {
    return `This action updates a #${id} membre`;
  }

  remove(id: number) {
    return `This action removes a #${id} membre`;
  }

  async removeMember(club: number, student: number) {
    // Vérifiez si le membre existe avec les relations entre étudiant et club
    console.log(student);
    console.log(club);
    const existingMember = await this.membreResp.findOne({
      where: {
        studentId: { id: student },
        clubId: { id: club },
      },
    });
    console.log(existingMember);
    if (!existingMember) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Le membre avec l'ID étudiant ${student} n'appartient pas au club ${club}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Supprimez le membre
    await this.membreResp.remove(existingMember);

    return {
      status: HttpStatus.OK,
      message: `Le membre avec l'ID étudiant ${student} a été retiré du club ${club}.`,
    };
  }
}
