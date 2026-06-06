/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

export class CreateTenantDto {
  name: string;
  slug: string;
  domain?: string;
  plan?: string;
  adminEmail: string;
  adminPassword: string;
  adminName?: string;
}

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

  async findAllTenants() {
    return this.prisma.tenant.findMany({
      include: {
        settings: true,
        _count: {
          select: { products: true, users: true, orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findTenant(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: { settings: true },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async createTenant(dto: CreateTenantDto) {
    const existing = await this.prisma.tenant.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) throw new ConflictException('Slug already in use');

    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        domain: dto.domain,
        plan: (dto.plan as any) ?? 'FREE',
        isActive: true,
      },
    });

    // Tenant admin kullanıcısı oluştur
    const hashedPassword = (await bcrypt.hash(dto.adminPassword, 10)) as string;
    await this.prisma.user.create({
      data: {
        email: dto.adminEmail,
        password: hashedPassword,
        name: dto.adminName,
        role: 'TENANT_ADMIN',
        tenantId: tenant.id,
      },
    });

    // Default settings oluştur
    await this.prisma.tenantSettings.create({
      data: { tenantId: tenant.id },
    });

    return tenant;
  }

  async updateTenant(
    id: string,
    data: { name?: string; domain?: string; plan?: string; isActive?: boolean },
  ) {
    await this.findTenant(id);
    return this.prisma.tenant.update({
      where: { id },
      data: { ...data, plan: data.plan as any },
    });
  }

  async deleteTenant(id: string) {
    await this.findTenant(id);
    return this.prisma.tenant.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
