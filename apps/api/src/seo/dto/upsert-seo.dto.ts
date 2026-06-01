import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpsertSeoDto {
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  canonicalUrl?: string;

  @IsBoolean()
  @IsOptional()
  noIndex?: boolean;

  @IsString()
  @IsOptional()
  ogTitle?: string;

  @IsString()
  @IsOptional()
  ogDescription?: string;

  @IsString()
  @IsOptional()
  ogImage?: string;

  @IsString()
  @IsOptional()
  ogType?: string;

  @IsString()
  @IsOptional()
  twitterCard?: string;

  @IsString()
  @IsOptional()
  twitterTitle?: string;

  @IsString()
  @IsOptional()
  twitterDescription?: string;

  @IsString()
  @IsOptional()
  twitterImage?: string;

  @IsOptional()
  schemaOrg?: Record<string, unknown>;
}
