import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { IsString, IsOptional } from 'class-validator';

class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

interface AuthRequest extends Request {
  user: { sub: string };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async me(@Req() req: AuthRequest) {
    return this.userService.findById(req.user.sub);
  }

  @Put('me')
  async update(@Req() req: AuthRequest, @Body() dto: UpdateUserDto) {
    return this.userService.update(req.user.sub, dto);
  }
}
