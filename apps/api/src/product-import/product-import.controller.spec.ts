import { Test, TestingModule } from '@nestjs/testing';
import { ProductImportController } from './product-import.controller';

describe('ProductImportController', () => {
  let controller: ProductImportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductImportController],
    }).compile();

    controller = module.get<ProductImportController>(ProductImportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
