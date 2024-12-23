import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty({ message: 'Le nom complet est obligatoire.' })
  fullName: string;

  @Column({ unique: true })
  @Matches(/^\d{8}$/, {
    message: 'Le numéro de téléphone doit contenir exactement 8 chiffres.',
  })
  @IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire.' })
  phone: string;

  @Column({ unique: true })
  @IsEmail({}, { message: "L'adresse email n'est pas valide." })
  @IsNotEmpty({ message: "L'email est obligatoire." })
  email: string;

  @Column()
  @IsString()
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
  })
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  password: string;

  @Column()
  @IsNotEmpty({ message: 'Le rôle est obligatoire.' })
  @IsIn(['admin', 'student', 'club'], {
    message: 'Le rôle doit être soit admin, student ou club.',
  })
  role: string;
}
