import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import sharp from 'sharp';

@Injectable()
export class ImageService {
  private readonly storageZone: string;
  private readonly apiKey: string;
  private readonly hostname: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.storageZone = this.configService.get<string>('BUNNY_STORAGE_ZONE')!;
    this.apiKey = this.configService.get<string>('BUNNY_STORAGE_API_KEY')!;
    this.hostname = this.configService.get<string>('BUNNY_STORAGE_HOSTNAME')!;
  }

  private async uploadToBunny(
    buffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<string> {
    const uploadUrl = `https://${this.hostname}/${this.storageZone}/${filename}`;

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        AccessKey: this.apiKey,
        'Content-Type': mimetype,
      },
      body: buffer as BodyInit,
    });

    if (!response.ok) {
      throw new BadRequestException('Failed to upload image to CDN');
    }

    return `https://${this.storageZone}.b-cdn.net/${filename}`;
  }

  async uploadImage(
    file: Express.Multer.File,
    productId: string,
    tenantSlug: string,
    variantId?: string,
    isMain = false,
  ) {
    if (!file) throw new BadRequestException('No file provided');

    const timestamp = Date.now();
    const baseName = `${tenantSlug}/${productId}/${timestamp}`;
    const originalBuffer = file.buffer;

    const originalUrl = await this.uploadToBunny(
      await sharp(originalBuffer).webp({ quality: 85 }).toBuffer(),
      `${baseName}.webp`,
      'image/webp',
    );

    const thumbBuffer = await sharp(originalBuffer)
      .resize(400, 400, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();
    const thumbUrl = await this.uploadToBunny(
      thumbBuffer,
      `${baseName}-thumb.webp`,
      'image/webp',
    );

    const ogBuffer = await sharp(originalBuffer)
      .resize(1200, 630, { fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer();
    const ogUrl = await this.uploadToBunny(
      ogBuffer,
      `${baseName}-og.webp`,
      'image/webp',
    );

    const lastImage = await this.prisma.productImage.findFirst({
      where: { productId },
      orderBy: { order: 'desc' },
    });

    const order = lastImage ? lastImage.order + 1 : 0;

    return this.prisma.productImage.create({
      data: {
        productId,
        variantId,
        url: originalUrl,
        thumbUrl,
        ogUrl,
        order,
        isMain,
      },
    });
  }

  async setMain(id: string) {
    const image = await this.prisma.productImage.findUnique({ where: { id } });
    if (!image) throw new BadRequestException('Image not found');

    await this.prisma.productImage.updateMany({
      where: { productId: image.productId },
      data: { isMain: false },
    });

    return this.prisma.productImage.update({
      where: { id },
      data: { isMain: true },
    });
  }

  async deleteImage(id: string) {
    const image = await this.prisma.productImage.findUnique({ where: { id } });
    if (!image) throw new BadRequestException('Image not found');

    const filename = image.url.split('.b-cdn.net/')[1];
    const deleteUrl = `https://${this.hostname}/${this.storageZone}/${filename}`;

    await fetch(deleteUrl, {
      method: 'DELETE',
      headers: { AccessKey: this.apiKey },
    });

    return this.prisma.productImage.delete({ where: { id } });
  }
}
