import { v4 as uuidv4 } from 'uuid';
import { CheckoutSessionManager, CheckoutSession } from '../models/CheckoutSession';
import { PricingRuleService } from './PricingRuleService';
import { PricingRule, CartItem } from '../models/PricingRule';
import { SessionNotFoundError, ProductNotFoundError } from '../utils/errors';
import { PRODUCTS } from '../models/Product';

export class CheckoutService {
  private sessionManager = new CheckoutSessionManager();

  createCheckoutSession(customRules?: PricingRule[]): CheckoutSession {
    const sessionId = uuidv4();
    const pricingRules = customRules || PricingRuleService.getDefaultRules();
    return this.sessionManager.createSession(sessionId, pricingRules);
  }

  scanItem(sessionId: string, sku: string): CartItem[] {
    const session = this.sessionManager.getSession(sessionId);
    if (!session) {
      throw new SessionNotFoundError(sessionId);
    }

    if (!PRODUCTS[sku]) {
      throw new ProductNotFoundError(sku);
    }

    session.checkout.scan(sku);
    return session.checkout.getCartItems();
  }

  calculateTotal(sessionId: string): number {
    const session = this.sessionManager.getSession(sessionId);
    if (!session) {
      throw new SessionNotFoundError(sessionId);
    }

    return session.checkout.total();
  }

  getSessionDetails(sessionId: string): { cartItems: CartItem[]; total: number } {
    const session = this.sessionManager.getSession(sessionId);
    if (!session) {
      throw new SessionNotFoundError(sessionId);
    }

    return {
      cartItems: session.checkout.getCartItems(),
      total: session.checkout.total(),
    };
  }

  deleteSession(sessionId: string): boolean {
    return this.sessionManager.deleteSession(sessionId);
  }
}