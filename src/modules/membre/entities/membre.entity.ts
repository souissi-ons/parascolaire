import { User } from 'src/modules/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Membre {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'clubId' })
  clubId: User; // Lien vers l'utilisateur représentant le club

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'studentId' })
  studentId: User; // Lien vers l'utilisateur représentant l'étudiant
}
