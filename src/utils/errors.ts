export class CheckoutError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'CheckoutError';
  }
}

export class ProductNotFoundError extends CheckoutError {
  constructor(sku: string) {
    super(`Product with SKU '${sku}' not found`, 404);
    this.name = 'ProductNotFoundError';
  }
}

export class SessionNotFoundError extends CheckoutError {
  constructor(sessionId: string) {
    super(`Checkout session '${sessionId}' not found`, 404);
    this.name = 'SessionNotFoundError';
  }
}

export class ValidationError extends CheckoutError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}