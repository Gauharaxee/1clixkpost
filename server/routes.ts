import express, { type Express, Request, Response } from "express";
import { storage } from "./storage";
import { createPostSchema, insertPlatformConnectionSchema, insertPostSchema, PlatformType, postStatus } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { setupAuth, isAuthenticated } from "./replitAuth";

// Set up file upload with multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads");
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG and GIF are allowed.") as any);
    }
  }
});

export async function registerRoutes(app: Express): Promise<void> {
  // Referenced from blueprint:javascript_log_in_with_replit
  // Setup authentication
  await setupAuth(app);

  // Auth route to get current user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Platform connections
  app.get("/api/platform-connections", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connections = await storage.getPlatformConnections(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Failed to get platform connections" });
    }
  });

  app.post("/api/platform-connections", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connectionData = insertPlatformConnectionSchema.parse({ ...req.body, userId });
      const connection = await storage.createPlatformConnection(connectionData);
      res.status(201).json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid connection data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create platform connection" });
      }
    }
  });

  app.put("/api/platform-connections/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const connectionData = insertPlatformConnectionSchema.partial().parse(req.body);
      const connection = await storage.updatePlatformConnection(id, connectionData);
      res.json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid connection data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update platform connection" });
      }
    }
  });

  app.delete("/api/platform-connections/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePlatformConnection(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete platform connection" });
    }
  });

  // Posts
  app.get("/api/posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const posts = await storage.getUserPosts(userId, limit, offset);
      
      // For each post, get its associated platforms
      const postsWithPlatforms = await Promise.all(
        posts.map(async (post) => {
          const platforms = await storage.getPostPlatforms(post.id);
          return {
            ...post,
            platforms: platforms.map(p => p.platform)
          };
        })
      );
      
      res.json(postsWithPlatforms);
    } catch (error) {
      res.status(500).json({ message: "Failed to get posts" });
    }
  });

  app.get("/api/posts/recent", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getUserPosts(userId, 5, 0);
      
      // For each post, get its associated platforms
      const postsWithPlatforms = await Promise.all(
        posts.map(async (post) => {
          const platforms = await storage.getPostPlatforms(post.id);
          return {
            id: post.id,
            content: post.content,
            imageUrl: post.imageUrl,
            platforms: platforms.map(p => p.platform),
            date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            }) : new Date(post.createdAt).toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            }),
            status: post.status,
            engagement: platforms.reduce((sum, platform) => sum + (platform.engagementCount || 0), 0)
          };
        })
      );
      
      res.json(postsWithPlatforms);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent posts" });
    }
  });

  app.get("/api/posts/scheduled", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getScheduledPosts(userId);
      
      // For each post, get its associated platforms
      const postsWithPlatforms = await Promise.all(
        posts.map(async (post) => {
          const platforms = await storage.getPostPlatforms(post.id);
          return {
            id: post.id,
            content: post.content,
            imageUrl: post.imageUrl,
            platforms: platforms.map(p => p.platform),
            date: post.scheduledAt ? new Date(post.scheduledAt).toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            }) : '',
            time: post.scheduledAt ? new Date(post.scheduledAt).toLocaleTimeString('en-US', {
              hour: 'numeric', minute: '2-digit', hour12: true
            }) : '',
            status: post.status,
            engagement: 0
          };
        })
      );
      
      res.json(postsWithPlatforms);
    } catch (error) {
      res.status(500).json({ message: "Failed to get scheduled posts" });
    }
  });

  app.get("/api/posts/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const platforms = await storage.getPostPlatforms(post.id);
      
      res.json({
        post,
        platforms
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get post" });
    }
  });

  app.post("/api/posts", isAuthenticated, async (req: any, res) => {
    try {
      const postData = createPostSchema.parse(req.body);
      const userId = req.user.claims.sub;
      
      const status = postData.status || (postData.scheduledAt ? "scheduled" : "published");
      const publishedAt = status === "published" ? new Date() : null;
      
      // Create the post
      const post = await storage.createPost({
        userId,
        content: postData.content,
        imageUrl: postData.imageUrl,
        status,
        scheduledAt: postData.scheduledAt ? new Date(postData.scheduledAt) : null,
        publishedAt
      });
      
      // Create post platform entries
      const platforms = await Promise.all(
        postData.platforms.map(platform => 
          storage.createPostPlatform({
            postId: post.id,
            platform,
            status: "pending"
          })
        )
      );
      
      res.status(201).json({
        post,
        platforms
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid post data", errors: error.errors });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to create post" });
      }
    }
  });

  app.put("/api/posts/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const postData = insertPostSchema.partial().parse(req.body);
      const post = await storage.updatePost(id, postData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid post data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update post" });
      }
    }
  });

  app.delete("/api/posts/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePost(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Image upload
  app.post("/api/upload", isAuthenticated, upload.single("image"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // In a production app, you'd likely upload to a CDN here
      // For this example, we'll just return the file path
      const imageUrl = `/uploads/${req.file.filename}`;
      
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Analytics
  app.get("/api/analytics/overview", isAuthenticated, (req, res) => {
    // In a real app, this would fetch analytics data from the database or third-party APIs
    const mockAnalytics = {
      totalPosts: 48,
      totalPostsGrowth: 12.5,
      engagement: 3500,
      engagementGrowth: 8.2,
      reach: 12400,
      reachGrowth: 15.7,
      clickRate: 2.8,
      clickRateGrowth: -2.3,
      engagementByPlatform: {
        meta: 1200,
        twitter: 900,
        linkedin: 800,
        google: 600
      },
      reachByPlatform: {
        meta: 5000,
        twitter: 3200,
        linkedin: 2800,
        google: 1400
      },
      clicksByPlatform: {
        meta: 150,
        twitter: 120,
        linkedin: 95,
        google: 60
      }
    };
    
    res.json(mockAnalytics);
  });

  app.get("/api/analytics/chart-data", isAuthenticated, (req, res) => {
    // In a real app, this would generate chart data based on actual analytics
    const timeRange = req.query.timeRange || "30days";
    
    const mockChartData = [
      { name: "Jan", meta: 400, twitter: 240, linkedin: 240, google: 100 },
      { name: "Feb", meta: 300, twitter: 139, linkedin: 250, google: 120 },
      { name: "Mar", meta: 200, twitter: 980, linkedin: 210, google: 140 },
      { name: "Apr", meta: 278, twitter: 390, linkedin: 200, google: 160 },
      { name: "May", meta: 189, twitter: 480, linkedin: 250, google: 180 },
      { name: "Jun", meta: 239, twitter: 380, linkedin: 260, google: 200 },
      { name: "Jul", meta: 349, twitter: 430, linkedin: 280, google: 220 }
    ];
    
    res.json(mockChartData);
  });

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
}
