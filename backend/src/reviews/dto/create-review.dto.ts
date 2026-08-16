import { IsInt, IsOptional, IsString, Max, Min, Length } from "class-validator";

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  @Length(0, 1200)
  comment?: string;
}
