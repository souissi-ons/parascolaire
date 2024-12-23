import { IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateClassroomDto {
  @IsString()
  @IsNotEmpty({ message: 'Le num de salle est obligatoire.' })
  num: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'La capacité de salle est obligatoire.' })
  capacity: number;

  @IsBoolean()
  available?: boolean = true; // Set default value
}
