import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    await registerRoutes(app);

    // Add health check endpoint for Cloud Run
    app.get("/health", (req, res) => {
      res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
    });

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      log(`Error: ${message}`);
    });

    // Use process.env.PORT for Cloud Run compatibility with fallback
    const port = parseInt(process.env.PORT || "5000", 10);
    const isDevelopment = process.env.NODE_ENV === "development";
    const isCloudRun = !!process.env.PORT; // Cloud Run sets PORT environment variable

    log(`Environment: ${process.env.NODE_ENV || 'unknown'}, Port: ${port}, Cloud Run: ${isCloudRun}`);

    // Use production mode for Cloud Run deployment even if NODE_ENV=development
    if (isDevelopment && !isCloudRun) {
      // Local development with Vite HMR
      const server = createServer(app);
      await setupVite(app, server);
      server.listen(port, "0.0.0.0", () => {
        log(`serving on port ${port} (development mode)`);
      });
    } else {
      // Production mode or Cloud Run deployment
      try {
        serveStatic(app);
        log("Static assets loaded successfully");
      } catch (error: any) {
        log(`Warning: Static assets not available: ${error?.message || error}`);
        log("Server will continue without static assets but API endpoints will work");
        
        // Provide fallback for missing static assets
        app.use("*", (req, res, next) => {
          if (req.path.startsWith("/api") || req.path === "/health") {
            // Let API routes and health check through
            return next();
          }
          
          // For root path, serve a basic HTML page explaining the situation
          if (req.path === "/") {
            return res.status(200).type("html").send(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Service Unavailable</title>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
                    h1 { color: #333; }
                    p { color: #666; line-height: 1.6; }
                    a { color: #0066cc; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                  </style>
                </head>
                <body>
                  <h1>Service Starting</h1>
                  <p>The application is starting up. Static assets are being prepared.</p>
                  <p>If this message persists, please check the server logs or visit the <a href="/health">health endpoint</a>.</p>
                </body>
              </html>
            `);
          }
          
          // For all other routes, return a helpful error message
          res.status(503).json({ 
            error: "Service temporarily unavailable", 
            message: "Static assets not found. Server is running but frontend is not available.",
            health: "/health"
          });
        });
      }
      
      const server = app.listen(port, "0.0.0.0", () => {
        log(`serving on port ${port} (production mode)`);
        log(`Health check available at http://0.0.0.0:${port}/health`);
        log(`Server started successfully for Cloud Run`);
      });

      // Graceful shutdown for Cloud Run
      const shutdown = () => {
        log('Shutdown signal received, closing server gracefully');
        server.close(() => {
          log('Server closed successfully');
          process.exit(0);
        });
      };

      process.on('SIGTERM', shutdown);
      process.on('SIGINT', shutdown);
    }
  } catch (error) {
    log(`Failed to start server: ${error}`);
    process.exit(1);
  }
})();
