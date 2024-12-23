import { Transform } from "class-transformer";
import { IsDate, IsIn, IsNotEmpty, IsNumber, IsString, IsTimeZone } from "class-validator";

export class CreateEventDto {
      @IsString()
      @IsNotEmpty()
      name: string;

      @Transform(({ value }) => new Date(value))
      @IsDate()
      @IsNotEmpty()
      startDateTime: Date;
    
      @Transform(({ value }) => new Date(value))
      @IsDate()
      @IsNotEmpty()
      endDateTime: Date;
    
      @IsString()
      @IsNotEmpty()
      imageUrl: string;
    
      @IsNumber()
      @IsNotEmpty()
      roomId: number;
    
      @IsNumber()
      @IsNotEmpty()
      organizerId: number;
    
      @IsString()
      @IsNotEmpty()
      description: string;
    
      @IsString()
      @IsNotEmpty()
      @IsIn(['pending', 'confirmed', 'canceled','refused'], {
          message: 'Le statut doit être soit pending, confirmed, canceled ou refused.',
        })
      status?: string = 'pending';
}
