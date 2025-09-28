# Zeller Checkout System

A TypeScript checkout system for Zeller's computer store with flexible pricing rules and promotional discounts.

## What This Project Does

This is a checkout system that handles products and applies special deals automatically. Think of it like a smart cash register that knows about promotions.

## Products Available

| SKU | Name        | Price    |
|-----|-------------|----------|
| ipd | Super iPad  | $549.99  |
| mbp | MacBook Pro | $1399.99 |
| atv | Apple TV    | $109.50  |
| vga | VGA adapter | $30.00   |

## Special Deals

**Apple TV Deal:** Buy 3, pay for 2 only
- If you scan 3 Apple TVs, you only pay for 2
- Example: 3 × $109.50 = $219.00 (saves you $109.50)

**iPad Bulk Discount:** Buy 5 or more, get them cheaper
- When buying 5+ iPads, price drops to $499.99 each
- Example: 5 × $499.99 = $2499.95 (instead of $2749.95)

## How It Works

The system has two parts:

### 1. Core Checkout Class (Original Requirement)
Simple interface as requested:
```typescript
const co = new Checkout(pricingRules);
co.scan('ipd');  // Add iPad to cart
co.scan('atv');  // Add Apple TV to cart
co.total();      // Get final price with discounts
```

### 2. REST API (Added Feature)
Web API for integration with other systems:
- Create shopping sessions
- Add items to cart
- Calculate totals with discounts
- View products and pricing rules

## Example Scenarios

**Scenario 1:** Scan `atv, atv, atv, vga`
- 3 Apple TVs (3-for-2 deal) + 1 VGA adapter
- Total: $249.00

**Scenario 2:** Scan `atv, ipd, ipd, atv, ipd, ipd, ipd`
- 2 Apple TVs + 5 iPads (bulk discount applies)
- Total: $2718.95

## Quick Start

### Install and Run
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm test            # Run tests
npm run build       # Build for production
```

### View API Documentation
When server is running, visit: **http://localhost:3000/api/docs**

Beautiful, interactive API documentation (better than Swagger) where you can:
- See all available endpoints
- Test API calls directly in your browser
- View request/response examples
- Understand the data formats

### Test the API
```bash
# Check if API is running
curl http://localhost:3000/api/health

# See all products
curl http://localhost:3000/api/products

# Create checkout session
curl -X POST http://localhost:3000/api/checkout

# Add item to cart (replace {sessionId} with actual ID)
curl -X POST http://localhost:3000/api/checkout/{sessionId}/scan \
  -H "Content-Type: application/json" \
  -d '{"sku": "ipd"}'

# Get total with discounts applied
curl http://localhost:3000/api/checkout/{sessionId}/total
```

## Project Structure

```
src/
├── models/          # Core classes (Checkout, Product, PricingRule)
├── services/        # Business logic (pricing calculations)
├── controllers/     # API request handlers
├── routes/          # API endpoints
├── middleware/      # Request validation
├── schemas/         # Data validation rules
└── utils/           # Helper functions

tests/
├── unit/            # Individual component tests
└── integration/     # API endpoint tests
```

## Key Features

- **Flexible Pricing Rules:** Easy to add new promotions
- **Type Safety:** Full TypeScript with validation
- **Comprehensive Testing:** Unit and integration tests
- **Auto-Generated Docs:** API documentation from code
- **Clean Architecture:** Separation of concerns
- **Input Validation:** Prevents invalid data
- **Error Handling:** Graceful error responses

## Technology Stack

- **TypeScript:** For type safety and better development
- **Express.js:** Web framework for REST API
- **Zod:** Schema validation
- **Jest:** Testing framework
- **Scalar:** Beautiful API documentation (better than Swagger)

## Design Decisions

**1. Pricing Rules as Classes**
- Each discount type is a separate class
- Easy to add new rule types
- Rules can be combined and reused

**2. Session-Based Checkout**
- Web API uses session IDs for cart management
- Multiple customers can shop simultaneously
- Core checkout class remains stateful as required

**3. Automatic Documentation**
- API docs generated from validation schemas
- Always stays in sync with actual code
- No manual documentation maintenance

**4. Comprehensive Validation**
- Input validation at API level
- Type checking at compile time
- Business rule validation in services

## Adding New Features

**New Product:**
```typescript
// Add to Product.ts
export const PRODUCTS = {
  // ... existing products
  'new': { sku: 'new', name: 'New Product', price: 99.99 }
};
```

**New Pricing Rule:**
```typescript
// Create new rule class
export class NewDiscountRule extends PricingRule {
  apply(cart: CartItem[]): number {
    // Your discount logic here
  }
}
```

The system is designed to be easily extensible while maintaining the simple interface required by the original specification.