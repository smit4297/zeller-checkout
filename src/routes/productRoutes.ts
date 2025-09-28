import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { validateRequest } from '../middleware/zodValidation';
import { SkuParamsSchema } from '../schemas/validation';

const router = Router();
const productController = new ProductController();

router.get('/', productController.getAllProducts);

router.get('/:sku', validateRequest(SkuParamsSchema), productController.getProductBySku);

export default router;