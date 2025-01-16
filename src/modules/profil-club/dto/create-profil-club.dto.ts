import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfilClubDto {
  @ApiProperty({
    description: 'The ID of the user associated with the Profil Club',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'URL of the image',
    example: 'https://example.com/image.png',
    required: false,
  })
  // @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Domain or area of expertise',
    example: 'Technology',
  })
  @IsString()
  @IsNotEmpty()
  domaine: string;

  @ApiProperty({
    description: 'Facebook profile URL',
    example: 'https://facebook.com/example',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @ApiProperty({
    description: 'Instagram profile URL',
    example: 'https://instagram.com/example',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  instagram?: string;

  @ApiProperty({
    description: 'LinkedIn profile URL',
    example: 'https://linkedin.com/in/example',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @ApiProperty({ description: 'Creation date', example: '2024-12-25' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
}
