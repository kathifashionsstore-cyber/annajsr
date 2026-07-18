import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Load environment variables locally
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api/chat') && req.method === 'POST') {
            try {
              let body = '';
              for await (const chunk of req) {
                body += chunk;
              }
              const payload = JSON.parse(body || '{}');
              
              // Dynamically import the Vercel function handler
              const chatHandler = await import('./api/chat.js');
              
              const vercelRes = {
                statusCode: 200,
                headers: {},
                setHeader(name, value) {
                  this.headers[name] = value;
                  res.setHeader(name, value);
                },
                status(code) {
                  this.statusCode = code;
                  res.statusCode = code;
                  return this;
                },
                json(data) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                }
              };

              await chatHandler.default({
                method: req.method,
                body: payload,
                headers: req.headers,
                socket: req.socket
              }, vercelRes);
              
            } catch (err) {
              console.error('Vite API Middleware error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          } else {
            next();
          }
        });
      }
    }
  ],
})
