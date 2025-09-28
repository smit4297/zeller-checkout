import { Checkout } from '../../src/models/Checkout';
import { PricingRuleService } from '../../src/services/PricingRuleService';

describe('Checkout', () => {
  let checkout: Checkout;

  beforeEach(() => {
    const pricingRules = PricingRuleService.getDefaultRules();
    checkout = new Checkout(pricingRules);
  });

  describe('scan method', () => {
    it('should add a single item to cart', () => {
      checkout.scan('ipd');
      const cartItems = checkout.getCartItems();

      expect(cartItems).toHaveLength(1);
      expect(cartItems[0]?.product.sku).toBe('ipd');
      expect(cartItems[0]?.quantity).toBe(1);
    });

    it('should increment quantity when scanning the same item multiple times', () => {
      checkout.scan('ipd');
      checkout.scan('ipd');
      checkout.scan('ipd');

      const cartItems = checkout.getCartItems();
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0]?.quantity).toBe(3);
    });

    it('should add different items separately', () => {
      checkout.scan('ipd');
      checkout.scan('mbp');
      checkout.scan('atv');

      const cartItems = checkout.getCartItems();
      expect(cartItems).toHaveLength(3);
    });

    it('should throw error for invalid SKU', () => {
      expect(() => checkout.scan('invalid')).toThrow("Product with SKU 'invalid' not found");
    });
  });

  describe('total method', () => {
    it('should calculate total for single item without discount', () => {
      checkout.scan('mbp');
      expect(checkout.total()).toBe(1399.99);
    });

    it('should calculate total for multiple different items', () => {
      checkout.scan('mbp');
      checkout.scan('vga');
      expect(checkout.total()).toBe(1429.99);
    });

    it('should apply 3 for 2 discount on Apple TV', () => {
      checkout.scan('atv');
      checkout.scan('atv');
      checkout.scan('atv');
      checkout.scan('vga');

      expect(checkout.total()).toBe(249.00);
    });

    it('should apply bulk discount on iPad when buying 5 or more', () => {
      checkout.scan('atv');
      checkout.scan('ipd');
      checkout.scan('ipd');
      checkout.scan('atv');
      checkout.scan('ipd');
      checkout.scan('ipd');
      checkout.scan('ipd');

      expect(checkout.total()).toBe(2718.95);
    });

    it('should not apply bulk discount on iPad when buying less than 5', () => {
      checkout.scan('ipd');
      checkout.scan('ipd');
      checkout.scan('ipd');
      checkout.scan('ipd');

      expect(checkout.total()).toBe(2199.96);
    });

    it('should handle complex scenario with multiple discounts', () => {
      checkout.scan('atv');
      checkout.scan('atv');
      checkout.scan('atv');
      checkout.scan('ipd');
      checkout.scan('ipd');
      checkout.scan('ipd');
      checkout.scan('ipd');
      checkout.scan('ipd');

      const expectedTotal = 219.00 + 2499.95;
      expect(checkout.total()).toBe(expectedTotal);
    });

    it('should return 0 for empty cart', () => {
      expect(checkout.total()).toBe(0);
    });
  });
});