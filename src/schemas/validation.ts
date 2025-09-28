import { z } from 'zod';
import { VALID_SKUS } from '../models/Product';


export const SkuSchema = z.enum(VALID_SKUS, {
  message: `SKU must be one of: ${VALID_SKUS.join(', ')}`,
});

export const UuidSchema = z.string().uuid('Must be a valid UUID');

export const ScanItemRequestSchema = z.object({
  body: z.object({
    sku: SkuSchema,
  }),
  params: z.object({
    sessionId: UuidSchema,
  }),
});

export const SessionParamsSchema = z.object({
  params: z.object({
    sessionId: UuidSchema,
  }),
});

export const SkuParamsSchema = z.object({
  params: z.object({
    sku: SkuSchema,
  }),
});

export const ProductResponseSchema = z.object({
  sku: SkuSchema,
  name: z.string(),
  price: z.number().positive(),
});

export const CartItemResponseSchema = z.object({
  product: ProductResponseSchema,
  quantity: z.number().int().positive(),
});

export const CheckoutSessionResponseSchema = z.object({
  sessionId: UuidSchema,
  createdAt: z.date(),
  message: z.string(),
});

export const ScanItemResponseSchema = z.object({
  sessionId: UuidSchema,
  cartItems: z.array(CartItemResponseSchema),
  message: z.string(),
});

export const TotalResponseSchema = z.object({
  sessionId: UuidSchema,
  cartItems: z.array(CartItemResponseSchema),
  total: z.number(),
});

export type ScanItemRequest = z.infer<typeof ScanItemRequestSchema>;
export type SessionParams = z.infer<typeof SessionParamsSchema>;
export type SkuParams = z.infer<typeof SkuParamsSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type CartItemResponse = z.infer<typeof CartItemResponseSchema>;
export type CheckoutSessionResponse = z.infer<typeof CheckoutSessionResponseSchema>;
export type ScanItemResponse = z.infer<typeof ScanItemResponseSchema>;
export type TotalResponse = z.infer<typeof TotalResponseSchema>;