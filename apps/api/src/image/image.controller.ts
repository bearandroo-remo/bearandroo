import {
  Controller,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Put,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import * as tenantMiddleware from '../tenant/tenant.middleware';

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  @UseInterceptors(FileInterceptor('file', { storage: undefined }))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('productId') productId: string,
    @Query('variantId') variantId?: string,
    @Query('isMain') isMain?: string,
    @Req() req?: tenantMiddleware.TenantRequest,
  ) {
    return this.imageService.uploadImage(
      file,
      productId,
      req?.tenantSlug ?? 'default',
      variantId,
      isMain === 'true',
    );
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.imageService.deleteImage(id);
  }

  @Put(':id/main')
  setMain(@Param('id') id: string) {
    return this.imageService.setMain(id);
  }
}
