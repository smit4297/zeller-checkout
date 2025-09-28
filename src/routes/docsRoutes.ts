import { Router, Request, Response } from 'express';
import { generateOpenAPISpec } from '../utils/openapi';

const router = Router();

router.get('/openapi.json', (req: Request, res: Response) => {
  try {
    const spec = generateOpenAPISpec();
    res.json(spec);
  } catch (error) {
    console.error('Error generating OpenAPI spec:', error);
    res.status(500).json({ error: 'Failed to generate OpenAPI specification' });
  }
});

router.get('/', (req: Request, res: Response) => {
  const openApiUrl = `${req.protocol}://${req.get('host')}/api/docs/openapi.json`;

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Zeller Checkout System API Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="${openApiUrl}"
      data-configuration='{"theme":"purple","layout":"modern","showSidebar":true}'
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest"></script>
  </body>
</html>`;

  res.send(html);
});

export default router;