import { ProductService } from '../../src/services/ProductService';
import { ProductNotFoundError } from '../../src/utils/errors';

describe('ProductService', () => {
  describe('getAllProducts', () => {
    it('should return all products', () => {
      const products = ProductService.getAllProducts();

      expect(products).toHaveLength(4);
      expect(products.map(p => p.sku)).toEqual(['ipd', 'mbp', 'atv', 'vga']);
    });
  });

  describe('getProductBySku', () => {
    it('should return product for valid SKU', () => {
      const product = ProductService.getProductBySku('ipd');

      expect(product.sku).toBe('ipd');
      expect(product.name).toBe('Super iPad');
      expect(product.price).toBe(549.99);
    });

    it('should throw ProductNotFoundError for invalid SKU', () => {
      expect(() => ProductService.getProductBySku('invalid'))
        .toThrow(ProductNotFoundError);
    });
  });

  describe('getProductSkus', () => {
    it('should return all product SKUs', () => {
      const skus = ProductService.getProductSkus();

      expect(skus).toEqual(['ipd', 'mbp', 'atv', 'vga']);
    });
  });
});