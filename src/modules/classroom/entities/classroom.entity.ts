import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Classroom {

 @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  num: string;

  @Column()
  capacity: number;

  @Column({default : true})
  available: boolean;
}