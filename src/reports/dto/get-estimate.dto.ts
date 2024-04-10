import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsNotEmpty()
  @IsString()
  make: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(1950)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;
}
