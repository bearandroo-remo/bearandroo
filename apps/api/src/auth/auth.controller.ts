import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TenantService } from '../tenant/tenant.service';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tenantService: TenantService,
  ) {}

  private async getTenantId(req: Request): Promise<string> {
    const apiKey = req.headers['x-api-key'] as string;
    const domain = (req.headers['x-tenant-domain'] as string) ?? req.hostname;
    const tenant = await this.tenantService.validateTenant(domain, apiKey);
    return tenant.id;
  }

  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    const tenantId = await this.getTenantId(req);
    return this.authService.register(
      dto.email,
      dto.password,
      tenantId,
      dto.name,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const tenantId = await this.getTenantId(req);
    return this.authService.login(dto.email, dto.password, tenantId);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: { userId: string }) {
    return this.authService.refresh(dto.userId);
  }
}
