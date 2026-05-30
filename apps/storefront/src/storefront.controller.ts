import { Controller, Get } from '@nestjs/common';
import { StorefrontService } from './storefront.service';

@Controller()
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Get()
  getHello(): string {
    return this.storefrontService.getHello();
  }
}
