import { Request, Response, NextFunction } from 'express';
import { CheckoutService } from '../services/CheckoutService';
import { ValidatedRequest } from '../middleware/zodValidation';
import { ScanItemRequest, SessionParams } from '../schemas/validation';

export class CheckoutController {
  private checkoutService = new CheckoutService();

  /**
   * Creates a new checkout session
   * @description Initializes a new shopping cart session for a customer
   * @returns {CheckoutSessionResponse} The newly created session with ID and timestamp
   */
  createCheckout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const session = this.checkoutService.createCheckoutSession();

      res.status(201).json({
        sessionId: session.id,
        createdAt: session.createdAt,
        message: 'Checkout session created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Scans an item and adds it to the checkout session
   * @description Adds a product to the customer's cart by SKU, applies pricing rules automatically
   * @param {string} sessionId - The checkout session ID
   * @param {string} sku - Product SKU to add (ipd, atv, mbp, vga)
   * @returns {ScanItemResponse} Updated cart contents with item counts
   */
  scanItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { params: { sessionId }, body: { sku } } = (req as ValidatedRequest<ScanItemRequest>).validatedData;

      const cartItems = this.checkoutService.scanItem(sessionId, sku);

      res.status(200).json({
        sessionId,
        cartItems,
        message: `Item ${sku} scanned successfully`,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Calculates and returns the total for a checkout session
   * @description Gets the cart contents and total price with all applicable discounts and pricing rules applied
   * @param {string} sessionId - The checkout session ID
   * @returns {TotalResponse} Cart items and final total price
   */
  getTotal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { params: { sessionId } } = (req as ValidatedRequest<SessionParams>).validatedData;

      const sessionDetails = this.checkoutService.getSessionDetails(sessionId);

      res.status(200).json({
        sessionId,
        cartItems: sessionDetails.cartItems,
        total: sessionDetails.total,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletes a checkout session
   * @description Removes a checkout session and all associated cart data
   * @param {string} sessionId - The checkout session ID to delete
   * @returns {object} Success message or error if session not found
   */
  deleteSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { params: { sessionId } } = (req as ValidatedRequest<SessionParams>).validatedData;

      const deleted = this.checkoutService.deleteSession(sessionId);

      if (deleted) {
        res.status(200).json({
          message: 'Checkout session deleted successfully',
        });
      } else {
        res.status(404).json({
          error: 'Checkout session not found',
        });
      }
    } catch (error) {
      next(error);
    }
  };
}