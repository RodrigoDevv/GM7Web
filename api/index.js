import app from '../server/index.js';

// Vercel invokes this Express app as a serverless function. The vercel.json
// rewrites forward /api/* and /auth/* here while preserving the original URL.
export default app;
