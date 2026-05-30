import { Injectable } from '@nestjs/common';

@Injectable()
export class StorefrontService {
  getHello(): string {
    return 'Hello World!';
  }
}
