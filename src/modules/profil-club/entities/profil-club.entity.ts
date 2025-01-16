import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProfilClub {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'userId' })
  @Column({ unique: true }) // Ajout de la contrainte d'unicité
  userId: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  domaine: string;

  @Column()
  facebook: string;

  @Column()
  instagram: string;

  @Column()
  linkedin: string;

  @Column()
  createdAt: Date;
}
