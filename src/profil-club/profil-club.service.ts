import { Injectable } from '@nestjs/common';
import { CreateProfilClubDto } from './dto/create-profil-club.dto';
import { UpdateProfilClubDto } from './dto/update-profil-club.dto';

@Injectable()
export class ProfilClubService {
  create(createProfilClubDto: CreateProfilClubDto) {
    return 'This action adds a new profilClub';
  }

  findAll() {
    return `This action returns all profilClub`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profilClub`;
  }

  update(id: number, updateProfilClubDto: UpdateProfilClubDto) {
    return `This action updates a #${id} profilClub`;
  }

  remove(id: number) {
    return `This action removes a #${id} profilClub`;
  }
}
