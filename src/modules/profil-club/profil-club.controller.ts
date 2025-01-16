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
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@ApiBearerAuth()
@Public()
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

  @Post('club/:id/upload-image')
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
  async uploadClubImage(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Mettre à jour ou créer le profil du club avec le nouveau chemin de l'image
    const imageUrl = `/uploads/${file.filename}`;
    console.log("Chemin de l'image :", imageUrl);

    const result = await this.profilClubService.uploadOrUpdateClubImage(
      id,
      imageUrl,
    );
    console.log('Résultat de la création/mise à jour du profil :', result);

    // Retourner le résultat
    return result;
  }

  @Get()
  findAll() {
    return this.profilClubService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.profilClubService.findOne(+id);
  }

  @Get('club/:id')
  findByClub(@Param('id') id: number) {
    return this.profilClubService.findByClub(+id);
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

  @Get('club/:id/image')
  async getClubImage(@Param('id') id: number, @Res() res: Response) {
    try {
      // Obtenez le chemin absolu de l'image à partir de l'ID du profil
      const imagePath = await this.profilClubService.getImageByClubId(id);

      // Si imagePath est une chaîne vide, retourner une réponse vide
      if (imagePath === '') {
        return res.status(200).send('');
      }

      // Envoyer l'image en réponse HTTP
      return res.sendFile(imagePath);
    } catch (error) {
      // En cas d'erreur, retourner une réponse vide
      return res.status(200).send('');
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

  @Patch('club/:id')
  async updateOrCreateProfilClub(
    @Param('id') id: number,
    @Body() updateProfilClubDto: UpdateProfilClubDto,
  ) {
    // Appeler la méthode pour mettre à jour ou créer le profil club
    return this.profilClubService.updateOrCreateProfilClub(
      id,
      updateProfilClubDto,
    );
  }
}
