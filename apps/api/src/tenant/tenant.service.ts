import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Tenant } from '@prisma/index';
// import { Tenant } from '../../../generated/prisma/client.js';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async findByDomain(domain: string) {
    return this.prisma.tenant.findUnique({ where: { domain } });
  }

  async findByApiKey(apiKey: string) {
    return this.prisma.tenant.findUnique({ where: { apiKey } });
  }

  async findById(id: string) {
    return this.prisma.tenant.findUnique({ where: { id } });
  }

  async validateTenant(domain?: string, apiKey?: string): Promise<Tenant> {
    let tenant: Tenant | null = null;

    if (apiKey) {
      tenant = await this.findByApiKey(apiKey);
    } else if (domain) {
      tenant = await this.findByDomain(domain);
    }

    if (!tenant || !tenant.isActive) {
      throw new UnauthorizedException('Invalid or inactive tenant');
    }

    return tenant;
  }
}
