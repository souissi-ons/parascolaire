import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMembreDto {
  // @ApiProperty({
  //   description: "L'ID du club auquel le membre est associé",
  //   example: 7,
  // })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  clubId: number;

  // @ApiProperty({
  //   description: "L'ID de l'étudiant qui doit devenir membre du club",
  //   example: 8,
  // })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  studentId: number;
}
