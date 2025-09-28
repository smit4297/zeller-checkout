import { Checkout } from './Checkout';
import { PricingRule } from './PricingRule';

export interface CheckoutSession {
  readonly id: string;
  readonly checkout: Checkout;
  readonly createdAt: Date;
}

export class CheckoutSessionManager {
  private sessions: Map<string, CheckoutSession> = new Map();

  createSession(id: string, pricingRules: PricingRule[]): CheckoutSession {
    const session: CheckoutSession = {
      id,
      checkout: new Checkout(pricingRules),
      createdAt: new Date(),
    };

    this.sessions.set(id, session);
    return session;
  }

  getSession(id: string): CheckoutSession | undefined {
    return this.sessions.get(id);
  }

  deleteSession(id: string): boolean {
    return this.sessions.delete(id);
  }

  getAllSessions(): CheckoutSession[] {
    return Array.from(this.sessions.values());
  }
}