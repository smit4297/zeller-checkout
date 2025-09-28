import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

// Register reusable schemas
const ProductSchema = registry.register('Product', z.object({
  sku: z.enum(['ipd', 'mbp', 'atv', 'vga']).openapi({ example: 'ipd' }),
  name: z.string().openapi({ example: 'Super iPad' }),
  price: z.number().positive().openapi({ example: 549.99 }),
}).openapi({ example: { sku: 'ipd', name: 'Super iPad', price: 549.99 } }));

const CartItemSchema = registry.register('CartItem', z.object({
  product: ProductSchema,
  quantity: z.number().int().positive().openapi({ example: 2 }),
}).openapi({ example: { product: { sku: 'ipd', name: 'Super iPad', price: 549.99 }, quantity: 2 } }));

const ErrorSchema = registry.register('Error', z.object({
  error: z.string().openapi({ example: 'Session not found' }),
  details: z.string().optional().openapi({ example: 'The requested session ID does not exist' }),
}).openapi({ example: { error: 'Session not found', details: 'The requested session ID does not exist' } }));

const CheckoutSessionSchema = registry.register('CheckoutSession', z.object({
  sessionId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  createdAt: z.string().datetime().openapi({ example: '2023-10-01T12:00:00.000Z' }),
  message: z.string().openapi({ example: 'Checkout session created successfully' }),
}).openapi({ example: { sessionId: '123e4567-e89b-12d3-a456-426614174000', createdAt: '2023-10-01T12:00:00.000Z', message: 'Checkout session created successfully' } }));

const ScanItemResponseSchema = registry.register('ScanItemResponse', z.object({
  sessionId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  cartItems: z.array(CartItemSchema),
  message: z.string().openapi({ example: 'Item ipd scanned successfully' }),
}).openapi({ example: { sessionId: '123e4567-e89b-12d3-a456-426614174000', cartItems: [{ product: { sku: 'ipd', name: 'Super iPad', price: 549.99 }, quantity: 1 }], message: 'Item ipd scanned successfully' } }));

const TotalResponseSchema = registry.register('TotalResponse', z.object({
  sessionId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  cartItems: z.array(CartItemSchema),
  total: z.number().openapi({ example: 1099.98 }),
}).openapi({ example: { sessionId: '123e4567-e89b-12d3-a456-426614174000', cartItems: [{ product: { sku: 'ipd', name: 'Super iPad', price: 549.99 }, quantity: 2 }], total: 1099.98 } }));

registry.registerPath({
  method: 'post',
  path: '/api/checkout',
  description: 'Create a new checkout session',
  tags: ['Checkout'],
  responses: {
    201: {
      description: 'Checkout session created successfully',
      content: {
        'application/json': {
          schema: CheckoutSessionSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/checkout/{sessionId}/scan',
  description: 'Scan an item and add it to the checkout session',
  tags: ['Checkout'],
  request: {
    params: z.object({
      sessionId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    }).openapi({}),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            sku: z.enum(['ipd', 'mbp', 'atv', 'vga']).openapi({ example: 'ipd', description: 'Product SKU to add to cart' }),
          }).openapi({ example: { sku: 'ipd' } }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Item scanned successfully',
      content: {
        'application/json': {
          schema: ScanItemResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid request data',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
    404: {
      description: 'Session not found',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/checkout/{sessionId}/total',
  description: 'Get the total for a checkout session',
  tags: ['Checkout'],
  request: {
    params: z.object({
      sessionId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    }).openapi({}),
  },
  responses: {
    200: {
      description: 'Total calculated successfully',
      content: {
        'application/json': {
          schema: TotalResponseSchema,
        },
      },
    },
    404: {
      description: 'Session not found',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/checkout/{sessionId}',
  description: 'Delete a checkout session',
  tags: ['Checkout'],
  request: {
    params: z.object({
      sessionId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    }).openapi({}),
  },
  responses: {
    200: {
      description: 'Session deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Checkout session deleted successfully' }),
          }).openapi({ example: { message: 'Checkout session deleted successfully' } }),
        },
      },
    },
    404: {
      description: 'Session not found',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/products',
  description: 'Get all available products',
  tags: ['Products'],
  responses: {
    200: {
      description: 'Products retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            products: z.array(ProductSchema),
            count: z.number().openapi({ example: 4 }),
          }).openapi({ example: { products: [{ sku: 'ipd', name: 'Super iPad', price: 549.99 }], count: 4 } }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/products/{sku}',
  description: 'Get a product by SKU',
  tags: ['Products'],
  request: {
    params: z.object({
      sku: z.enum(['ipd', 'mbp', 'atv', 'vga']).openapi({ example: 'ipd', description: 'Product SKU' }),
    }).openapi({}),
  },
  responses: {
    200: {
      description: 'Product retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            product: ProductSchema,
          }).openapi({ example: { product: { sku: 'ipd', name: 'Super iPad', price: 549.99 } } }),
        },
      },
    },
    404: {
      description: 'Product not found',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/pricing-rules',
  description: 'Get all active pricing rules',
  tags: ['Pricing Rules'],
  responses: {
    200: {
      description: 'Pricing rules retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            pricingRules: z.array(z.object({
              sku: z.string(),
              name: z.string(),
              type: z.string(),
            })),
            count: z.number(),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/health',
  description: 'Check API health status',
  tags: ['Health'],
  responses: {
    200: {
      description: 'API is healthy',
      content: {
        'application/json': {
          schema: z.object({
            status: z.string(),
            timestamp: z.string(),
            service: z.string(),
          }),
        },
      },
    },
  },
});

export function generateOpenAPISpec(baseUrl?: string) {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  // Determine the base URL dynamically
  const servers = [];

  if (baseUrl) {
    servers.push({
      url: baseUrl,
      description: 'Current deployment',
    });
  } else {
    // Default to localhost for development
    servers.push({
      url: 'http://localhost:3000',
      description: 'Development server',
    });
  }

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Zeller Checkout System API',
      description: 'TypeScript checkout system for Zeller\'s computer store with flexible pricing rules and promotional discounts.',
      contact: {
        name: 'Zeller Dev Team',
        email: 'dev@zeller.co',
      },
    },
    servers,
    tags: [
      {
        name: 'Checkout',
        description: 'Checkout session management',
      },
      {
        name: 'Products',
        description: 'Product catalog',
      },
      {
        name: 'Pricing Rules',
        description: 'Promotional pricing rules',
      },
      {
        name: 'Health',
        description: 'API health check',
      },
    ],
  });
}