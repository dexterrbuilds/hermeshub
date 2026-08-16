import { IsBooleanString, IsIn, IsNumberString, IsOptional, IsString } from "class-validator";

export class SearchBusinessesDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsBooleanString()
  verified?: string;

  @IsOptional()
  @IsBooleanString()
  available?: string;

  @IsOptional()
  @IsIn(["distance", "rating", "relevance", "newest"])
  sort?: "distance" | "rating" | "relevance" | "newest";

  @IsOptional()
  @IsNumberString()
  latitude?: string;

  @IsOptional()
  @IsNumberString()
  longitude?: string;
}
