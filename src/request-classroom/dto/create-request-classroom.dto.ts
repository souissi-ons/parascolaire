import { JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRequestClassroomDto {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty({ message: 'La date de début est obligatoire.' })
  startDateTime: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty({ message: 'La date de fin est obligatoire.' })
  endDateTime: Date;

  @JoinColumn({ name: 'roomId' })
  @IsNumber()
  @IsNotEmpty({ message: 'La salle est obligatoire.' })
  roomId: number;

  @JoinColumn({ name: 'requestedBy' })
  @IsNumber()
  @IsNotEmpty({ message: "L'utilisateur est obligatoire." })
  requestedBy: number;

  @IsString()
  @IsNotEmpty({ message: 'La raison de la demande est obligatoire.' })
  reason: String;

  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'confirmed', 'canceled', 'refused'], {
    message:
      'Le statut doit être soit pending, confirmed, canceled ou refused.',
  })
  status?: string = 'pending';
}
