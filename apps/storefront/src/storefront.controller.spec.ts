import { Test, TestingModule } from '@nestjs/testing';
import { StorefrontController } from './storefront.controller';
import { StorefrontService } from './storefront.service';

describe('StorefrontController', () => {
  let storefrontController: StorefrontController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StorefrontController],
      providers: [StorefrontService],
    }).compile();

    storefrontController = app.get<StorefrontController>(StorefrontController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(storefrontController.getHello()).toBe('Hello World!');
    });
  });
});
