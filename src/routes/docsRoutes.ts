import { Router, Request, Response } from 'express';
import { generateOpenAPISpec } from '../utils/openapi';

const router = Router();

router.get('/openapi.json', (req: Request, res: Response) => {
  try {
    // Set CORS headers for proper loading
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Content-Type', 'application/json');

    // Construct the base URL dynamically for the current deployment
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const spec = generateOpenAPISpec(baseUrl);
    res.json(spec);
  } catch (error) {
    console.error('Error generating OpenAPI spec:', error);
    res.status(500).json({ error: 'Failed to generate OpenAPI specification' });
  }
});

router.get('/', (req: Request, res: Response) => {
  // Use relative URL for better compatibility with Vercel
  const openApiUrl = '/api/docs/openapi.json';

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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-size: 18px;
        color: #666;
      }
      .error {
        display: none;
        text-align: center;
        padding: 20px;
        color: #d32f2f;
        background: #ffebee;
        margin: 20px;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <div class="loading">Loading API Documentation...</div>
    <div class="error" id="error-message">
      <h3>Unable to load API documentation</h3>
      <p>The OpenAPI specification could not be loaded. Please try refreshing the page.</p>
      <p><a href="${openApiUrl}" target="_blank">View OpenAPI JSON directly</a></p>
    </div>
    <script
      id="api-reference"
      data-url="${openApiUrl}"
      data-configuration='{"theme":"purple","layout":"modern","showSidebar":true}'
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest" onerror="document.querySelector('.loading').style.display='none'; document.querySelector('.error').style.display='block';"></script>
    <script>
      // Hide loading message once the API reference loads
      window.addEventListener('load', function() {
        setTimeout(function() {
          const loading = document.querySelector('.loading');
          if (loading) loading.style.display = 'none';
        }, 2000);
      });
    </script>
  </body>
</html>`;

  res.send(html);
});

export default router;