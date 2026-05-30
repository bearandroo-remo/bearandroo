import {
  IsString,
  IsNumber,
  IsInt,
  IsObject,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdateVariantDto {
  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsObject()
  @IsOptional()
  attributes?: Record<string, string>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
