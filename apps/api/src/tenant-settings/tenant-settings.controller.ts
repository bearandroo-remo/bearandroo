import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { TenantSettingsService } from './tenant-settings.service';
import { UpsertTenantSettingsDto } from './dto/upsert-tenant-settings.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import * as tenantMiddleware from '../tenant/tenant.middleware';

@Controller('tenant-settings')
export class TenantSettingsController {
  constructor(private tenantSettingsService: TenantSettingsService) {}

  @Get()
  findByTenant(@Req() req: tenantMiddleware.TenantRequest) {
    return this.tenantSettingsService.findByTenant(req.tenantId!);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  upsert(
    @Req() req: tenantMiddleware.TenantRequest,
    @Body() dto: UpsertTenantSettingsDto,
  ) {
    return this.tenantSettingsService.upsert(req.tenantId!, dto);
  }
}
