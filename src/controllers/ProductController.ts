import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/ProductService';
import { ValidatedRequest } from '../middleware/zodValidation';
import { SkuParams } from '../schemas/validation';

export class ProductController {
  /**
   * Get all available products
   * @description Retrieves the complete product catalog with SKUs, names, and base prices
   * @returns {ProductResponse[]} Array of all products available in the store
   */
  getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const products = ProductService.getAllProducts();

      res.status(200).json({
        products,
        count: products.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a specific product by SKU
   * @description Retrieves detailed information for a single product using its SKU identifier
   * @param {string} sku - Product SKU (ipd, atv, mbp, vga)
   * @returns {ProductResponse} Product details including name and price
   */
  getProductBySku = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { params: { sku } } = (req as ValidatedRequest<SkuParams>).validatedData;
      const product = ProductService.getProductBySku(sku);

      res.status(200).json({
        product,
      });
    } catch (error) {
      next(error);
    }
  };
}