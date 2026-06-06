import {
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductImportService } from './product-import.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import * as tenantMiddleware from '../tenant/tenant.middleware';
import express from 'express';

@Controller('product-import')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TENANT_ADMIN', 'SUPER_ADMIN')
export class ProductImportController {
  constructor(private productImportService: ProductImportService) {}

  @Get('template')
  downloadTemplate(@Res() res: express.Response) {
    const buffer = this.productImportService.generateTemplate();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=urun-import-template.xlsx',
    );
    res.send(buffer);
  }

  @Post('validate')
  @UseInterceptors(FileInterceptor('file', { storage: undefined }))
  async validate(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: tenantMiddleware.TenantRequest,
  ) {
    return this.productImportService.validate(file.buffer, req.tenantId!);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file', { storage: undefined }))
  async import(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: tenantMiddleware.TenantRequest,
  ) {
    return this.productImportService.import(file.buffer, req.tenantId!);
  }
}
