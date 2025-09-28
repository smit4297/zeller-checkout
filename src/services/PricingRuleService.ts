import { PricingRule, QuantityBasedDiscountRule, BulkDiscountRule } from '../models/PricingRule';

export class PricingRuleService {
  private static readonly DEFAULT_RULES: PricingRule[] = [
    new QuantityBasedDiscountRule('atv', '3 for 2 Apple TV Deal', 3, 2),
    new BulkDiscountRule('ipd', 'Super iPad Bulk Discount', 5, 499.99),
  ];

  static getDefaultRules(): PricingRule[] {
    return [...this.DEFAULT_RULES];
  }

  static createQuantityBasedRule(
    sku: string,
    name: string,
    requiredQuantity: number,
    payForQuantity: number
  ): PricingRule {
    return new QuantityBasedDiscountRule(sku, name, requiredQuantity, payForQuantity);
  }

  static createBulkDiscountRule(
    sku: string,
    name: string,
    minimumQuantity: number,
    discountedPrice: number
  ): PricingRule {
    return new BulkDiscountRule(sku, name, minimumQuantity, discountedPrice);
  }

  static getRulesBySku(rules: PricingRule[], sku: string): PricingRule[] {
    return rules.filter(rule => rule.sku === sku);
  }
}