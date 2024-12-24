import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProfilClub {

    @PrimaryGeneratedColumn()
    id: number;
    
    @OneToOne(() => User, (user) => user.id, { eager: true })
    @JoinColumn({ name: 'userId' })
    @Column({ unique: true }) // Ajout de la contrainte d'unicité
    userId: number;

    @Column()
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
