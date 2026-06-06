import { Test, TestingModule } from '@nestjs/testing';
import { ProductImportService } from './product-import.service';

describe('ProductImportService', () => {
  let service: ProductImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductImportService],
    }).compile();

    service = module.get<ProductImportService>(ProductImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
