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

    // Add root endpoint
    app.get("/", (req, res) => {
      res.redirect("/health");
    });

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      log(`Error: ${message}`);
    });

    // Use process.env.PORT for Cloud Run compatibility with fallback
    const port = parseInt(process.env.PORT || "5000", 10);

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      // Create a minimal server instance for Vite HMR in development
      const server = createServer(app);
      await setupVite(app, server);
      server.listen(port, "0.0.0.0", () => {
        log(`serving on port ${port}`);
      });
    } else {
      serveStatic(app);
      const server = app.listen(port, "0.0.0.0", () => {
        log(`serving on port ${port} (production mode)`);
        log(`Health check available at http://0.0.0.0:${port}/health`);
      });

      // Graceful shutdown for Cloud Run
      process.on('SIGTERM', () => {
        log('SIGTERM received, shutting down gracefully');
        server.close(() => {
          log('Process terminated');
          process.exit(0);
        });
      });

      process.on('SIGINT', () => {
        log('SIGINT received, shutting down gracefully');
        server.close(() => {
          log('Process terminated');
          process.exit(0);
        });
      });
    }
  } catch (error) {
    log(`Failed to start server: ${error}`);
    process.exit(1);
  }
})();
