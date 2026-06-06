import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TenantRequest } from '../tenant/tenant.middleware';

interface AuthRequest extends TenantRequest {
  user?: { sub: string; role: string };
}

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateOrderDto, @Req() req: AuthRequest) {
    return this.orderService.create(dto, req.tenantId!, req.user?.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  findAll(@Req() req: AuthRequest) {
    return this.orderService.findAll(req.tenantId!);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyOrders(@Req() req: AuthRequest) {
    return this.orderService.findByUser(req.user!.sub, req.tenantId!);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.orderService.findOne(id, req.tenantId!);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT_ADMIN', 'SUPER_ADMIN')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Req() req: AuthRequest,
  ) {
    return this.orderService.updateStatus(id, req.tenantId!, body.status);
  }
}
