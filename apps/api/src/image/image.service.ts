import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

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

  async uploadImage(
    file: Express.Multer.File,
    productId: string,
    variantId?: string,
    isMain = false,
  ) {
    if (!file) throw new BadRequestException('No file provided');

    const ext = file.originalname.split('.').pop();
    const filename = `${productId}/${Date.now()}.${ext}`;
    const uploadUrl = `https://${this.hostname}/${this.storageZone}/${filename}`;

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        AccessKey: this.apiKey,
        'Content-Type': file.mimetype,
      },
      body: file.buffer as BodyInit,
    });

    if (!response.ok) {
      throw new BadRequestException('Failed to upload image to CDN');
    }

    const cdnUrl = `https://${this.storageZone}.b-cdn.net/${filename}`;

    const lastImage = await this.prisma.productImage.findFirst({
      where: { productId },
      orderBy: { order: 'desc' },
    });

    const order = lastImage ? lastImage.order + 1 : 0;

    return this.prisma.productImage.create({
      data: {
        productId,
        variantId,
        url: cdnUrl,
        order,
        isMain,
      },
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

  async setMain(id: string) {
    const image = await this.prisma.productImage.findUnique({ where: { id } });
    if (!image) throw new BadRequestException('Image not found');

    // Önce tüm resimlerin isMain'ini false yap
    await this.prisma.productImage.updateMany({
      where: { productId: image.productId },
      data: { isMain: false },
    });

    // Sonra seçileni true yap
    return this.prisma.productImage.update({
      where: { id },
      data: { isMain: true },
    });
  }
}
