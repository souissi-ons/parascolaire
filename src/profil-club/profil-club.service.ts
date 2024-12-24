import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfilClubDto } from './dto/create-profil-club.dto';
import { UpdateProfilClubDto } from './dto/update-profil-club.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilClub } from './entities/profil-club.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfilClubService {
  constructor(@InjectRepository(ProfilClub) private profilClubRep: Repository<ProfilClub>,
    private readonly userService: UserService
  ) { }

  async create(createProfilClubDto: CreateProfilClubDto) {
    const newProfilClub = this.profilClubRep.create(createProfilClubDto);
    const user = await this.userService.findOne(createProfilClubDto.userId);
    if (user.role !== "club") {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: 'l\'utilisateur doit etre club.',
        },
        HttpStatus.CONFLICT,
      );
    }
    const existingProfilClub = await this.profilClubRep.findOneBy({ userId: newProfilClub.userId });
    if (existingProfilClub) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: 'Une Profile Club avec ce userId existe déjà.',
        },
        HttpStatus.CONFLICT,
      );
    }
    return this.profilClubRep.save(newProfilClub);
  }

  async findAll() {
    return this.profilClubRep.find();
  }

  async findOne(id: number) {
    const profilClub = await this.profilClubRep.findOneBy({ id });
    if (!profilClub) {
      throw new NotFoundException(`profil Club with id ${id} not found`);
    }
    return profilClub;
  }

  async update(id: number, updateProfilClubDto: UpdateProfilClubDto) {
        if ('userId' in updateProfilClubDto) {
          throw new HttpException(
            {
              status: HttpStatus.CONFLICT,
              message: 'Updating userId is not allowed. ',
            },
            HttpStatus.CONFLICT,
          );
        }
    const existingProfil = await this.findOne(id);
    const updateProfilClub = { ...existingProfil, ...updateProfilClubDto };
    return this.profilClubRep.save(updateProfilClub);  }

  async remove(id: number) {
    await this.findOne(id);
    return this.profilClubRep.delete({ id });
  }
}
