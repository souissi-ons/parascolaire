import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ProfilClubService } from './profil-club.service';
import { CreateProfilClubDto } from './dto/create-profil-club.dto';
import { UpdateProfilClubDto } from './dto/update-profil-club.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Public } from 'src/common/decorators/public.decorator';
import { Response } from 'express';

@ApiBearerAuth()
@Controller('profil-club')
export class ProfilClubController {
  constructor(private readonly profilClubService: ProfilClubService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Invalid file type'), false);
        }
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  create(
    @Body() createProfilClubDto: CreateProfilClubDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createProfilClubDto.imageUrl = `/uploads/${file.filename}`;
    }
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

  @Get(':id/image')
  async getImage(@Param('id') id: number, @Res() res: Response) {
    try {
      // Obtenez le chemin absolu de l'image à partir de l'ID du profil
      const imagePath = await this.profilClubService.getImageByProfilId(id);
      // Envoyer l'image en réponse HTTP
      return res.sendFile(imagePath);
    } catch (error) {
      throw new NotFoundException('Image not found');
    }
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Invalid file type'), false);
        }
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateProfilClubDto: UpdateProfilClubDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateProfilClubDto.imageUrl = `/uploads/${file.filename}`;
    }
    return this.profilClubService.update(+id, updateProfilClubDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilClubService.remove(+id);
  }
}
