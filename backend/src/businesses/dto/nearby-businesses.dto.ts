import { IsNumberString, IsOptional, IsString } from "class-validator";

export class NearbyBusinessesDto {
  @IsNumberString()
  latitude!: string;

  @IsNumberString()
  longitude!: string;

  @IsOptional()
  @IsNumberString()
  radius?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
