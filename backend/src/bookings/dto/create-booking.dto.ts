import { IsDateString, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateBookingDto {
  @IsUUID()
  businessId!: string;

  @IsUUID()
  serviceId!: string;

  @IsOptional()
  @IsUUID()
  addressId?: string;

  @IsDateString()
  requestedDate!: string;

  @IsString()
  @Length(4, 8)
  requestedTime!: string;

  @IsOptional()
  @IsString()
  @Length(0, 800)
  notes?: string;
}
