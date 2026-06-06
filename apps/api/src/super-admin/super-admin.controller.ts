import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SuperAdminService, CreateTenantDto } from './super-admin.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class SuperAdminController {
  constructor(private superAdminService: SuperAdminService) {}

  @Get('tenants')
  findAll() {
    return this.superAdminService.findAllTenants();
  }

  @Get('tenants/:id')
  findOne(@Param('id') id: string) {
    return this.superAdminService.findTenant(id);
  }

  @Post('tenants')
  create(@Body() dto: CreateTenantDto) {
    return this.superAdminService.createTenant(dto);
  }

  @Put('tenants/:id')
  update(
    @Param('id') id: string,
    @Body()
    body: { name?: string; domain?: string; plan?: string; isActive?: boolean },
  ) {
    return this.superAdminService.updateTenant(id, body);
  }

  @Delete('tenants/:id')
  delete(@Param('id') id: string) {
    return this.superAdminService.deleteTenant(id);
  }
}
