import { CheckoutService } from '../../src/services/CheckoutService';
import { SessionNotFoundError, ProductNotFoundError } from '../../src/utils/errors';

describe('CheckoutService', () => {
  let checkoutService: CheckoutService;

  beforeEach(() => {
    checkoutService = new CheckoutService();
  });

  describe('createCheckoutSession', () => {
    it('should create a new checkout session', () => {
      const session = checkoutService.createCheckoutSession();

      expect(session.id).toBeDefined();
      expect(session.checkout).toBeDefined();
      expect(session.createdAt).toBeInstanceOf(Date);
    });

    it('should create unique session IDs', () => {
      const session1 = checkoutService.createCheckoutSession();
      const session2 = checkoutService.createCheckoutSession();

      expect(session1.id).not.toBe(session2.id);
    });
  });

  describe('scanItem', () => {
    it('should scan item successfully', () => {
      const session = checkoutService.createCheckoutSession();
      const cartItems = checkoutService.scanItem(session.id, 'ipd');

      expect(cartItems).toHaveLength(1);
      expect(cartItems[0]?.product.sku).toBe('ipd');
      expect(cartItems[0]?.quantity).toBe(1);
    });

    it('should throw SessionNotFoundError for invalid session', () => {
      expect(() => checkoutService.scanItem('invalid-session', 'ipd'))
        .toThrow(SessionNotFoundError);
    });

    it('should throw ProductNotFoundError for invalid SKU', () => {
      const session = checkoutService.createCheckoutSession();

      expect(() => checkoutService.scanItem(session.id, 'invalid-sku'))
        .toThrow(ProductNotFoundError);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total correctly', () => {
      const session = checkoutService.createCheckoutSession();
      checkoutService.scanItem(session.id, 'ipd');
      checkoutService.scanItem(session.id, 'mbp');

      const total = checkoutService.calculateTotal(session.id);
      expect(total).toBe(1949.98);
    });

    it('should throw SessionNotFoundError for invalid session', () => {
      expect(() => checkoutService.calculateTotal('invalid-session'))
        .toThrow(SessionNotFoundError);
    });
  });

  describe('getSessionDetails', () => {
    it('should return session details', () => {
      const session = checkoutService.createCheckoutSession();
      checkoutService.scanItem(session.id, 'ipd');

      const details = checkoutService.getSessionDetails(session.id);

      expect(details.cartItems).toHaveLength(1);
      expect(details.total).toBe(549.99);
    });

    it('should throw SessionNotFoundError for invalid session', () => {
      expect(() => checkoutService.getSessionDetails('invalid-session'))
        .toThrow(SessionNotFoundError);
    });
  });

  describe('deleteSession', () => {
    it('should delete existing session', () => {
      const session = checkoutService.createCheckoutSession();
      const deleted = checkoutService.deleteSession(session.id);

      expect(deleted).toBe(true);
    });

    it('should return false for non-existing session', () => {
      const deleted = checkoutService.deleteSession('non-existing');
      expect(deleted).toBe(false);
    });
  });
});