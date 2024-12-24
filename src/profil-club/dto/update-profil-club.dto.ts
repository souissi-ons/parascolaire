import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProfilClubDto } from './create-profil-club.dto';

export class UpdateProfilClubDto extends PartialType(
    OmitType(CreateProfilClubDto, ['userId'] as const),
) {}

