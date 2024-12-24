import { IsDate, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Classroom } from 'src/classroom/entities/classroom.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class RequestClassroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDate()
  @IsNotEmpty({ message: 'La date de début est obligatoire.' })
  startDateTime: Date;

  @Column()
  @IsDate()
  @IsNotEmpty({ message: 'La date de fin est obligatoire.' })
  endDateTime: Date;

  @ManyToOne(() => Classroom, (classroom) => classroom.id, { eager: true })
  @JoinColumn({ name: 'roomId' })
  @IsNotEmpty({ message: 'La salle est obligatoire.' })
  roomId: number;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'requestedBy' })
  @IsNotEmpty({ message: "L'utilisateur est obligatoire." })
  requestedBy: number;

  @Column()
  @IsString()
  @IsNotEmpty({ message: 'La raison de la demande est obligatoire.' })
  reason: String;

  @Column({ default: 'pending' })
  @IsNotEmpty({ message: 'Le status est obligatoire.' })
  @IsIn(['pending', 'confirmed', 'canceled', 'refused'], {
    message:
      'Le statut doit être soit pending, confirmed, canceled ou refused.',
  })
  status: string;
}
