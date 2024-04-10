import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  make: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1950)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @Min(0)
  @Max(1000000)
  @IsNumber()
  price: number;
}
