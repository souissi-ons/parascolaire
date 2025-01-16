import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfilClubDto } from './dto/create-profil-club.dto';
import { UpdateProfilClubDto } from './dto/update-profil-club.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilClub } from './entities/profil-club.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/modules/user/user.service';
import { join } from 'path';
import * as fs from 'fs';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ProfilClubService {
  constructor(
    @InjectRepository(ProfilClub) private profilClubRep: Repository<ProfilClub>,
    @InjectRepository(User) private userRep: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async create(createProfilClubDto: CreateProfilClubDto) {
    const newProfilClub = this.profilClubRep.create(createProfilClubDto);
    const user = await this.userService.findOne(createProfilClubDto.userId);
    if (user.role !== 'club') {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: "l'utilisateur doit etre club.",
        },
        HttpStatus.CONFLICT,
      );
    }
    const existingProfilClub = await this.profilClubRep.findOneBy({
      userId: newProfilClub.userId,
    });
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

  async findByClub(id: number) {
    const profilClub = await this.profilClubRep.findOne({
      where: { userId: id }, // Recherche par userId
      relations: ['userId'], // Charge les détails de l'utilisateur associé
    }); // Charge les détails de l'utilisateur associé);
    // Si le profil du club n'existe pas, charger les informations de l'utilisateur
    const user = await this.userRep.findOne({
      where: { id }, // Rechercher l'utilisateur par son ID
    });

    if (!profilClub) {
      // Retourner un objet avec les informations de l'utilisateur
      return {
        id: null, // Aucun profil de club n'existe
        description: null,
        facebook: null,
        instagram: null,
        linkedin: null,
        creationDate: null,
        imageUrl: null,
        userId: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      };
    }
    return profilClub;
  }

  async update(id: number, updateProfilClubDto: UpdateProfilClubDto) {
    if ('userId' in updateProfilClubDto) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: 'Updating userId is not allowed.',
        },
        HttpStatus.CONFLICT,
      );
    }
    const existingProfil = await this.findOne(id);
    const updateProfilClub = { ...existingProfil, ...updateProfilClubDto };
    return this.profilClubRep.save(updateProfilClub);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.profilClubRep.delete({ id });
  }

  async getImageByProfilId(id: number): Promise<string> {
    // Rechercher le profil par ID
    const profil = await this.findOne(id);
    if (!profil) {
      throw new NotFoundException('Profil not found');
    }

    // Construire le chemin absolu vers l'image
    const imagePath = join(process.cwd(), profil.imageUrl.replace('/', ''));
    console.log(`Chemin de l'image : ${imagePath}`);

    // Vérifier si l'image existe
    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException('Image not found');
    }

    // Retourner le chemin de l'image
    return imagePath;
  }

  async getImageByClubId(id: number): Promise<string> {
    // Rechercher le profil par userId
    const profil = await this.profilClubRep.findOneBy({ userId: id });

    console.log(profil);
    if (!profil) {
      return '';
    }

    // Construire le chemin absolu vers l'image
    const imagePath = join(process.cwd(), profil.imageUrl.replace('/', ''));
    console.log(`Chemin de l'image : ${imagePath}`); // Vérifier si l'image existe
    if (!fs.existsSync(imagePath)) {
      // Si l'image n'existe pas, retourner une chaîne vide
      return '';
    }

    // Retourner le chemin de l'image
    return imagePath;
  }

  async uploadOrUpdateClubImage(userId: number, imageUrl: string) {
    // Rechercher le profil du club par userId
    let profilClub = await this.profilClubRep.findOneBy({ userId });

    if (!profilClub) {
      // Si le profil n'existe pas, créer un nouveau profil
      const newProfilClub = this.create({
        userId,
        imageUrl,
        facebook: '',
        instagram: '',
        linkedin: '',
        domaine: '',
        createdAt: new Date(), // Ajoutez la date de création
      });
      // Sauvegarder le nouveau profil dans la base de données
      console.log('Nouveau profil créé :', profilClub);
    } else {
      // Si le profil existe, mettre à jour le chemin de l'image
      profilClub.imageUrl = imageUrl;
      profilClub = await this.profilClubRep.save(profilClub);
      console.log('Profil mis à jour :', profilClub);
    }

    // Retourner le profil du club
    return profilClub;
  }

  async updateOrCreateProfilClub(
    userId: number,
    updateProfilClubDto: UpdateProfilClubDto,
  ) {
    // Rechercher le profil club par userId
    let profilClub = await this.profilClubRep.findOneBy({ userId });

    if (profilClub) {
      // Si le profil existe, mettre à jour tous les champs sauf l'image
      const { imageUrl, ...rest } = updateProfilClubDto; // Exclure imageUrl des données à mettre à jour
      profilClub = { ...profilClub, ...rest }; // Mettre à jour les autres champs
      return await this.profilClubRep.save(profilClub); // Utiliser await
    } else {
      // Si le profil n'existe pas, en créer un nouveau avec imageUrl = null
      const newProfilClub = this.profilClubRep.create({
        userId, // userId est un nombre
        ...updateProfilClubDto,
        imageUrl: null, // L'image est null par défaut
      });
      return await this.profilClubRep.save(newProfilClub); // Utiliser await
    }
  }
}
