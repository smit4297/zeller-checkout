import { PRODUCTS } from './Product';
import { PricingRule, CartItem } from './PricingRule';

export class Checkout {
  private cart: Map<string, CartItem> = new Map();

  constructor(private readonly pricingRules: PricingRule[]) {}

  scan(sku: string): void {
    const product = PRODUCTS[sku];
    if (!product) {
      throw new Error(`Product with SKU '${sku}' not found`);
    }

    const existingCartItem = this.cart.get(sku);
    if (existingCartItem) {
      this.cart.set(sku, {
        product,
        quantity: existingCartItem.quantity + 1,
      });
    } else {
      this.cart.set(sku, {
        product,
        quantity: 1,
      });
    }
  }

  total(): number {
    let totalAmount = 0;

    for (const cartItem of this.cart.values()) {
      const applicableRule = this.findPricingRule(cartItem.product.sku);

      if (applicableRule) {
        totalAmount += applicableRule.apply(cartItem);
      } else {
        totalAmount += cartItem.product.price * cartItem.quantity;
      }
    }

    return Math.round(totalAmount * 100) / 100;
  }

  getCartItems(): CartItem[] {
    return Array.from(this.cart.values());
  }

  private findPricingRule(sku: string): PricingRule | undefined {
    return this.pricingRules.find(rule => rule.sku === sku);
  }
}