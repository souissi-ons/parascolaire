import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfilClubService } from './profil-club.service';
import { CreateProfilClubDto } from './dto/create-profil-club.dto';
import { UpdateProfilClubDto } from './dto/update-profil-club.dto';

@Controller('profil-club')
export class ProfilClubController {
  constructor(private readonly profilClubService: ProfilClubService) {}

  @Post()
  create(@Body() createProfilClubDto: CreateProfilClubDto) {
    return this.profilClubService.create(createProfilClubDto);
  }

  @Get()
  findAll() {
    return this.profilClubService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilClubService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfilClubDto: UpdateProfilClubDto) {
    return this.profilClubService.update(+id, updateProfilClubDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilClubService.remove(+id);
  }
}
