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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: undefined }))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('productId') productId: string,
    @Query('variantId') variantId?: string,
    @Query('isMain') isMain?: string,
  ) {
    return this.imageService.uploadImage(
      file,
      productId,
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
