import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import checkoutRoutes from './routes/checkoutRoutes';
import productRoutes from './routes/productRoutes';
import pricingRuleRoutes from './routes/pricingRuleRoutes';
import docsRoutes from './routes/docsRoutes';

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/checkout', checkoutRoutes);
app.use('/api/products', productRoutes);
app.use('/api/pricing-rules', pricingRuleRoutes);
app.use('/api/docs', docsRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Zeller Checkout System',
  });
});

app.use(errorHandler);

export default app;