import { Classroom } from "src/classroom/entities/classroom.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Event {

  @PrimaryGeneratedColumn()
  id: number;

  @Column() 
  name: string;

  @Column() 
  startDateTime: Date;

  @Column()
  endDateTime: Date;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Classroom, (classroom) => classroom.id, { eager: true })  
  @JoinColumn({ name: 'roomId' }) 
  roomId: number;

  @ManyToOne(() => User, (user) => user.id, { eager: true })  
  @JoinColumn({ name: 'organizerId' }) 
  organizerId: number;

  @Column()
  description: string;

  @Column({ default: "pending" })
  status: string;
}
