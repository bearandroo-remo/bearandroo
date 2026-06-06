import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

interface AuthRequest extends Request {
  user: { sub: string };
}

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.addressService.findAll(req.user.sub);
  }

  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreateAddressDto) {
    return this.addressService.create(req.user.sub, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.addressService.remove(id, req.user.sub);
  }
}
