import { Router } from 'express';
import { PricingRuleController } from '../controllers/PricingRuleController';

const router = Router();
const pricingRuleController = new PricingRuleController();

router.get('/', pricingRuleController.getPricingRules);

export default router;