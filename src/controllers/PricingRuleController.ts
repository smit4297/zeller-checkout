import { Request, Response, NextFunction } from 'express';
import { PricingRuleService } from '../services/PricingRuleService';

export class PricingRuleController {
  /**
   * Get all active pricing rules
   * @description Retrieves all promotional pricing rules currently configured for the store
   * @returns {object} List of pricing rules with their types and affected SKUs
   * @example
   * // Returns rules like:
   * // - Apple TV: 3 for 2 deal
   * // - Super iPad: Bulk discount when buying 5+
   */
  getPricingRules = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const rules = PricingRuleService.getDefaultRules();

      const formattedRules = rules.map(rule => ({
        sku: rule.sku,
        name: rule.name,
        type: rule.constructor.name,
      }));

      res.status(200).json({
        pricingRules: formattedRules,
        count: formattedRules.length,
      });
    } catch (error) {
      next(error);
    }
  };
}