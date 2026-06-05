import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';

export interface TenantRequest extends Request {
  tenantId?: string;
  tenantSlug?: string;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantService: TenantService) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    // Super Admin tüm tenant'lara erişebilir
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const isSuperAdmin = (req as any).user?.role === 'SUPER_ADMIN';
    if (isSuperAdmin) {
      next();
      return;
    }

    // API Key veya domain'den tenant tespit et
    const apiKey = req.headers['x-api-key'] as string;
    const domain = (req.headers['x-tenant-domain'] as string) ?? req.hostname;

    try {
      const tenant = await this.tenantService.validateTenant(domain, apiKey);
      req.tenantId = tenant.id;
      req.tenantSlug = tenant.slug;
      next();
    } catch {
      throw new UnauthorizedException('Tenant not found');
    }
  }
}
