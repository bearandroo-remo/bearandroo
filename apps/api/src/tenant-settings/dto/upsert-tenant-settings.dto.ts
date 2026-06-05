import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertTenantSettingsDto {
  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  favicon?: string;

  @IsString()
  @IsOptional()
  colorPrimary?: string;

  @IsString()
  @IsOptional()
  colorSecondary?: string;

  @IsString()
  @IsOptional()
  colorAccent?: string;

  @IsString()
  @IsOptional()
  colorText?: string;

  @IsString()
  @IsOptional()
  colorBackground?: string;

  @IsString()
  @IsOptional()
  fontFamily?: string;

  @IsString()
  @IsOptional()
  borderRadius?: string;

  @IsOptional()
  headerLinks?: unknown;

  @IsOptional()
  heroSlides?: unknown;

  @IsString()
  @IsOptional()
  footerText?: string;

  @IsOptional()
  footerLinks?: unknown;

  @IsOptional()
  socialLinks?: unknown;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  siteTitle?: string;

  @IsString()
  @IsOptional()
  siteDescription?: string;

  @IsString()
  @IsOptional()
  shippingPolicy?: string;

  @IsString()
  @IsOptional()
  returnPolicy?: string;

  @IsString()
  @IsOptional()
  privacyPolicy?: string;

  @IsString()
  @IsOptional()
  termsOfService?: string;

  @IsOptional()
  faq?: unknown;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  freeShippingThreshold?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  shippingCost?: number;

  @IsString()
  @IsOptional()
  estimatedDelivery?: string;
}
