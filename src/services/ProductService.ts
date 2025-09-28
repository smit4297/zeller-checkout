import { Product, PRODUCTS } from '../models/Product';
import { ProductNotFoundError } from '../utils/errors';

export class ProductService {
  static getAllProducts(): Product[] {
    return Object.values(PRODUCTS);
  }

  static getProductBySku(sku: string): Product {
    const product = PRODUCTS[sku];
    if (!product) {
      throw new ProductNotFoundError(sku);
    }
    return product;
  }

  static getProductSkus(): string[] {
    return Object.keys(PRODUCTS);
  }
}