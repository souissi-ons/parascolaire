import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProfilClubDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    imageUrl: string;

    @IsString()
    @IsNotEmpty()
    domaine: string;

    facebook: string;

    instagram: string;

    linkedin: string;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    @IsNotEmpty()
    createdAt: Date;

}
