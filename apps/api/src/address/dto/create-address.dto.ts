import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  title: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  zip?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
