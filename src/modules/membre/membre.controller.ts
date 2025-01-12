import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MembreService } from './membre.service';
import { CreateMembreDto } from './dto/create-membre.dto';
import { UpdateMembreDto } from './dto/update-membre.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('membre')
export class MembreController {
  constructor(private readonly membreService: MembreService) {}

  @Public()
  @Post()
  create(@Body() createMembreDto: CreateMembreDto[]) {
    return this.membreService.createMultiple(createMembreDto);
  }

  @Get()
  findAll() {
    return this.membreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membreService.findOne(+id);
  }

  @Public()
  @Get(':id/members')
  getMembers(@Param('id') id: string) {
    return this.membreService.getMembers(+id);
  }

  @Public()
  @Get(':id/not-members')
  getNotMembers(@Param('id') id: string) {
    return this.membreService.getNonMembers(+id);
  }

  @Public()
  @Get(':id/clubs')
  getClubsByUserId(@Param('id') id: string) {
    return this.membreService.getClubsByUserId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembreDto: UpdateMembreDto) {
    return this.membreService.update(+id, updateMembreDto);
  }

  @Public()
  @Delete(':idClub/:idStudent')
  remove(
    @Param('idClub') idClub: number,
    @Param('idStudent') idStudent: number,
  ) {
    return this.membreService.removeMember(idClub, idStudent);
  }
}
