import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Zeller Checkout System server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});