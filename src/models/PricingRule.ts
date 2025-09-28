import { Product } from './Product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PricingRule {
  readonly sku: string;
  readonly name: string;
  apply(cartItem: CartItem): number;
}

export class QuantityBasedDiscountRule implements PricingRule {
  constructor(
    public readonly sku: string,
    public readonly name: string,
    private readonly requiredQuantity: number,
    private readonly payForQuantity: number
  ) {}

  apply(cartItem: CartItem): number {
    if (cartItem.product.sku !== this.sku) {
      return cartItem.product.price * cartItem.quantity;
    }

    const discountSets = Math.floor(cartItem.quantity / this.requiredQuantity);
    const remainingItems = cartItem.quantity % this.requiredQuantity;

    return (
      discountSets * this.payForQuantity * cartItem.product.price +
      remainingItems * cartItem.product.price
    );
  }
}

export class BulkDiscountRule implements PricingRule {
  constructor(
    public readonly sku: string,
    public readonly name: string,
    private readonly minimumQuantity: number,
    private readonly discountedPrice: number
  ) {}

  apply(cartItem: CartItem): number {
    if (cartItem.product.sku !== this.sku) {
      return cartItem.product.price * cartItem.quantity;
    }

    if (cartItem.quantity >= this.minimumQuantity) {
      return this.discountedPrice * cartItem.quantity;
    }

    return cartItem.product.price * cartItem.quantity;
  }
}