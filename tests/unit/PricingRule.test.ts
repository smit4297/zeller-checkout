import { QuantityBasedDiscountRule, BulkDiscountRule, CartItem } from '../../src/models/PricingRule';
import { PRODUCTS } from '../../src/models/Product';

describe('PricingRule', () => {
  describe('QuantityBasedDiscountRule', () => {
    let rule: QuantityBasedDiscountRule;

    beforeEach(() => {
      rule = new QuantityBasedDiscountRule('atv', '3 for 2 Apple TV Deal', 3, 2);
    });

    it('should apply discount when quantity meets requirement', () => {
      const cartItem: CartItem = {
        product: PRODUCTS['atv']!,
        quantity: 3,
      };

      const total = rule.apply(cartItem);
      expect(total).toBe(219.00);
    });

    it('should handle quantity with remainder', () => {
      const cartItem: CartItem = {
        product: PRODUCTS['atv']!,
        quantity: 4,
      };

      const total = rule.apply(cartItem);
      expect(total).toBe(328.50);
    });

    it('should not apply discount for different SKU', () => {
      const cartItem: CartItem = {
        product: PRODUCTS['ipd']!,
        quantity: 3,
      };

      const total = rule.apply(cartItem);
      expect(total).toBe(1649.97);
    });

    it('should handle quantity less than required', () => {
      const cartItem: CartItem = {
        product: PRODUCTS['atv']!,
        quantity: 2,
      };

      const total = rule.apply(cartItem);
      expect(total).toBe(219.00);
    });
  });

  describe('BulkDiscountRule', () => {
    let rule: BulkDiscountRule;

    beforeEach(() => {
      rule = new BulkDiscountRule('ipd', 'Super iPad Bulk Discount', 5, 499.99);
    });

    it('should apply bulk discount when quantity meets minimum', () => {
      const cartItem: CartItem = {
        product: PRODUCTS['ipd']!,
        quantity: 5,
      };

      const total = rule.apply(cartItem);
      expect(total).toBe(2499.95);
    });

    it('should not apply discount when quantity is below minimum', () => {
      const cartItem: CartItem = {
        product: PRODUCTS['ipd']!,
        quantity: 4,
      };

      const total = rule.apply(cartItem);
      expect(total).toBe(2199.96);
    });

    it('should not apply discount for different SKU', () => {
      const cartItem: CartItem = {
        product: PRODUCTS['atv']!,
        quantity: 5,
      };

      const total = rule.apply(cartItem);
      expect(total).toBe(547.50);
    });

    it('should handle large quantities', () => {
      const cartItem: CartItem = {
        product: PRODUCTS['ipd']!,
        quantity: 10,
      };

      const total = rule.apply(cartItem);
      expect(total).toBe(4999.90);
    });
  });
});