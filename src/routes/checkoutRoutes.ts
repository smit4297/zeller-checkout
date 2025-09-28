import { Router } from 'express';
import { CheckoutController } from '../controllers/CheckoutController';
import { validateRequest } from '../middleware/zodValidation';
import { ScanItemRequestSchema, SessionParamsSchema } from '../schemas/validation';

const router = Router();
const checkoutController = new CheckoutController();

router.post('/', checkoutController.createCheckout);

router.post('/:sessionId/scan', validateRequest(ScanItemRequestSchema), checkoutController.scanItem);

router.get('/:sessionId/total', validateRequest(SessionParamsSchema), checkoutController.getTotal);

router.delete('/:sessionId', validateRequest(SessionParamsSchema), checkoutController.deleteSession);

export default router;