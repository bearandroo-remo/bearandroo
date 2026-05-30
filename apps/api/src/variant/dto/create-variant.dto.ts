import { IsString, IsNumber, IsInt, IsObject, Min } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  productId: string;

  @IsString()
  sku: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsObject()
  attributes: Record<string, string>;
}
