import { Module } from '@nestjs/common';
import { TenantSettingsService } from './tenant-settings.service';
import { TenantSettingsController } from './tenant-settings.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TenantSettingsController],
  providers: [TenantSettingsService, PrismaService],
  exports: [TenantSettingsService],
})
export class TenantSettingsModule {}
